import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import { getIsAdmin } from "@/lib/auth/actions"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "RoManagement Admin Panel",
  description: "Manage workspaces, users, and admins",
};

export default async function BillingPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = await getIsAdmin(user.id);

  if (isAdmin === false || isAdmin === null) {
    redirect("/dashboard");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">RoManagement Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage workspaces, users, and admins</p>
      </div>
      <p>Work in progress...</p>
    </div>
  );
}
