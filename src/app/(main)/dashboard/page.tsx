import { redirect } from "next/navigation";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import * as React from "react";
import { Workspaces } from "./_components/workspaces";
import { WorkspacesSkeleton } from "./_components/workspaces-skeleton";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { myWorkspaceSchema } from "@/server/api/routers/workspace/workspace.input";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Workspaces",
  description: "Manage your workspaces here",
};

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { page, perPage } = myWorkspaceSchema.parse(searchParams);

  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  /**
   * Passing multiple promises to `Promise.all` to fetch data in parallel to prevent waterfall requests.
   * Passing promises to the `Workspaces` component to make them hot promises (they can run without being awaited) to prevent waterfall requests.
   * @see https://www.youtube.com/shorts/A7GGjutZxrs
   * @see https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
   */
  const promises = Promise.all([
    api.workspace.myWorkspaces.query({ page, perPage }),
    api.stripe.getPlan.query(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Workspaces</h1>
        <p className="text-sm text-muted-foreground">Manage your workspaces here</p>
      </div>
      <React.Suspense fallback={<WorkspacesSkeleton />}>
        <Workspaces promises={promises} />
      </React.Suspense>
    </div>
  );
}
