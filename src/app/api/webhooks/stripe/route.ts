import { headers } from "next/headers";
import type Stripe from "stripe";
import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { users, workspaces } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error."}`,
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session;

      const userId = checkoutSessionCompleted?.metadata?.userId;

      if (!userId) {
        return new Response("User id not found in checkout session metadata.", {
          status: 404,
        });
      }

      const subscription = await stripe.subscriptions.retrieve(
        checkoutSessionCompleted.subscription as string,
      );

      await db
        .update(users)
        .set({
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        })
        .where(eq(users.id, userId));

      break;
    }
    case "invoice.payment_succeeded": {
      const invoicePaymentSucceeded = event.data.object as Stripe.Invoice;

      const userId = invoicePaymentSucceeded?.metadata?.userId;

      if (!userId) {
        return new Response("User id not found in invoice metadata.", {
          status: 404,
        });
      }

      const subscription = await stripe.subscriptions.retrieve(
        invoicePaymentSucceeded.subscription as string,
      );

      await db
        .update(users)
        .set({
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        })
        .where(eq(users.id, userId));

      break;
    }
    case "customer.subscription.deleted":
    case "invoice.payment_failed": {
      const subscriptionEvent = event.data.object as Stripe.Subscription | Stripe.Invoice;

      const userId = subscriptionEvent?.metadata?.userId;

      if (!userId) {
        return new Response("User id not found in event metadata.", {
          status: 404,
        });
      }

      // Deactivate user workspaces
      await db
        .update(workspaces)
        .set({ status: "Inactive" })
        .where(eq(workspaces.ownerId, userId));

      break;
    }
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
