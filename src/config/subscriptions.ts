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
  features: ["Up to 5 workspaces", "Limited support", "Limited API requests per month", "Limited Rank Centers", "Limited Application Questions", "Unlimited Workspace Users", "Staff Management", "No Pre-Built Systems", "Documentation for Ranking", "No Chat Commands"],
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "The Pro plan has unlimited workspaces.",
  features: ["Unlimited workspaces", "Priority support", "Unlimited API requests", "Unlimited Rank Centers", "Unlimited Application Questions", "Unlimited Workspace Users", "Staff Management", "Pre-Built Systems for Ranking", "Documentation for Ranking", "Custom Chat Commands for Ranking"],
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID,
};

export const subscriptionPlans = [freePlan, proPlan];
