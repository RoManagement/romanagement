import Link from "next/link";
import { type Metadata } from "next";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { CopyToClipboard } from "./_components/copy-to-clipboard";
import {
  LuciaAuth,
  NextjsLight,
  NextjsDark,
  ReactJs,
} from "./_components/feature-icons";
import CardSpotlight from "./_components/hover-card";
import { api } from "@/trpc/server";
import React from "react";
import { BillingSkeleton } from "./_components/billing-skeleton";
import { Billing } from "./_components/billing";
import {
  BarChartBig,
  Webhook,
  ShieldHalf,
  Dock
} from "lucide-react"

export const metadata: Metadata = {
  title: "RoManagement",
  description: "Roblox Group Management made Simple.",
};

const features = [
  {
    name: "Ranking API",
    description: "Ranking API for managing group ranks within your roblox experiences.",
    logo: Webhook,
  },
  {
    name: "Activity Tracking",
    description: "Activity Tracking for your staff members and group members to see who meets their monthly quotas.",
    logo: BarChartBig,
  },
  {
    name: "Application Center",
    description: "Application Center for your group to manage incoming applications for your group.",
    logo: Dock,
  },
  {
    name: "Ranking Center",
    description: "Ranking Center for your group to automatically rank users who bought rank gamepasses.",
    logo: ShieldHalf,
  },
];

const HomePage = () => {
  const stripePromises = Promise.all([api.stripe.getLandingPlans.query()]);
  return (
    <>
      <div className="space-y-4">
        <section className="mx-auto grid min-h-[calc(100vh-300px)] max-w-5xl flex-col  items-center justify-center gap-4 py-10 text-center  md:py-12">
          <div className="p-4">
            <h1 className="text-balance bg-gradient-to-tr  from-black/70 via-black to-black/60 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-zinc-400/10 dark:via-white/90 dark:to-white/20  sm:text-5xl md:text-6xl lg:text-7xl">
              RoManagement
            </h1>
            <p className="mb-10 mt-4 text-balance text-center text-muted-foreground md:text-lg lg:text-xl">
              Roblox Group Management made Simple.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
        <section>
          <div className="container mx-auto lg:max-w-screen-lg">
            <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
              <a id="features"></a> Features
            </h1>
            <p className="mb-10 text-balance text-center text-muted-foreground md:text-lg lg:text-xl">
              RoManagement is an all-in-one solution for managing your Roblox group. From rank
              management to staff management, RoManagement has you covered.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {features.map((feature, i) => (
                <CardSpotlight
                  key={i}
                  name={feature.name}
                  description={feature.description}
                  logo={<feature.logo className="h-12 w-12" />}
                />
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="container mx-auto lg:max-w-screen-lg">
            <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
              <a id="pricing"></a> Pricing
            </h1>
            <p className="mb-10 text-balance text-center text-muted-foreground md:text-lg lg:text-xl">
              Try it free for 30 days. Plans start at $10/month.
            </p>
            <React.Suspense fallback={<BillingSkeleton />}>
              <Billing stripePromises={stripePromises} />
            </React.Suspense>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;

function NextjsIcon({ className }: { className?: string }) {
  return (
    <>
      <NextjsLight className={className + " dark:hidden"} />
      <NextjsDark className={className + " hidden dark:block"} />
    </>
  );
}
