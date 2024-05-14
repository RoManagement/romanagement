import React from "react";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { WorkspaceEditor } from "./_components/workspace-editor";
import { ArrowLeftIcon } from "@/components/icons";
import Link from "next/link";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";

interface Props {
  params: {
    workspaceId: string;
  };
}

export default async function EditWorkspacePage({ params }: Props) {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  const workspace = await api.post.get.query({ id: params.workspaceId });
  if (!workspace) notFound();

  return (
    <main className="container min-h-[calc(100vh-160px)] pt-3 md:max-w-screen-md">
      <Link
        href="/dashboard"
        className="mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeftIcon className="h-5 w-5" /> back to dashboard
      </Link>

      <WorkspaceEditor workspace={workspace} />
    </main>
  );
}
