import React from "react";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { AnnouncementPreview } from "./_components/announcement-preview";

interface Props {
  params: {
    workspaceId: string;
    announcementId: string;
  };
}

export default async function AnnouncementPage({ params }: Props) {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  const workspace = await api.workspace.get.query({ id: params.workspaceId });
  if (!workspace) notFound();

  if (workspace.status === "Inactive") notFound();

  const announcement = await api.post.get.query({ id: params.announcementId });
  if (!announcement) notFound();

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{announcement.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {new Date(announcement.createdAt).toLocaleDateString()}
        </p>
        <div className="prose dark:prose-invert max-w-none">
          <AnnouncementPreview text={announcement.content} />
        </div>
      </div>
    </div>
  );
}
