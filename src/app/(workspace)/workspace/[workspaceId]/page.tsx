import React from "react";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { WorkspaceEditor } from "./_components/workspace-editor";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { myPostsSchema } from "@/server/api/routers/post/post.input";

interface Props {
  params: {
    workspaceId: string;
  };
}

export default async function EditWorkspacePage({ params }: Props) {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  const workspace = await api.workspace.get.query({ id: params.workspaceId });
  if (!workspace) notFound();

  if (workspace.status === "Inactive") notFound();

  const { page, perPage } = myPostsSchema.parse(params);

  const promises = Promise.all([
    api.post.myPosts.query({ page, perPage, workspaceId: params.workspaceId}),
    api.stripe.getPlan.query(),
  ]);

  return (
    <>
    <WorkspaceEditor workspace={workspace} promises={promises} />
    </>
  );
}
