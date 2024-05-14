import { env } from "@/env";

export interface SubscriptionPlan {
  name: string;
  description: string;
  features: string[];
  stripePriceId: string;
}

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "The free plan is limited to 5 workspaces.",
  features: ["Up to 5 workspaces", "Limited support", "Limited API requests per month", "Unlimited Workspace Users", "Staff Management"],
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "The Pro plan has unlimited workspaces.",
  features: ["Unlimited workspaces", "Priority support", "Unlimited API requests", "Unlimited Workspace Users", "Staff Management"],
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID,
};

export const subscriptionPlans = [freePlan, proPlan];
