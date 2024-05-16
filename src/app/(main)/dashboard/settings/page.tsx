import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import { NewEmail } from "./_components/newEmail";
import { NewPassword } from "./_components/newPassword";
import { DeleteAccount } from "./_components/deleteAccount";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Settings",
  description: "Manage your account settings",
};

export default async function BillingPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>
      <div className="grid gap-6">
        <NewEmail user={user}/>
        <NewPassword/>
        <DeleteAccount user={user}/>
      </div>
    </div>
  );
}
