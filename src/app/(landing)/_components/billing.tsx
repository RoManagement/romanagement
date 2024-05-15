import Link from "next/link";

import { CheckIcon } from "@/components/icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type RouterOutputs } from "@/trpc/shared";

interface BillingProps {
  stripePromises: Promise<
    [RouterOutputs["stripe"]["getLandingPlans"]]
  >;
}

export async function Billing({ stripePromises }: BillingProps) {
  const [plans] = await stripePromises;

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-2">
        {plans.map((item) => (
          <Card key={item.name} className="flex flex-col p-2">
            <CardHeader className="h-full">
              <CardTitle className="line-clamp-1">{item.name}</CardTitle>
              <CardDescription className="line-clamp-2">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="h-full flex-1 space-y-6">
              <div className="text-3xl font-bold">
                {item.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
                {item.name === "Pro" && (
                    <p className="text-center text-sm text-muted-foreground">After 30 day trial</p>
                )}
              </div>
              <div className="space-y-2">
                {item.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="aspect-square shrink-0 rounded-full bg-foreground p-px text-background">
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button className="w-full" asChild>
                <Link href="/signup">
                  Get started
                  <span className="sr-only">Get started</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
}
