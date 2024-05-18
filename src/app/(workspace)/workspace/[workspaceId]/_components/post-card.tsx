"use client";

import { Pencil2Icon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { AnnouncementPreview } from "./announcement-preview";
import { ExternalLink } from "lucide-react";
import { EditAnnouncement } from "./edit-announcement";

interface PostCardProps {
  post: RouterOutputs["post"]["myPosts"][number];
  userName?: string;
  workspaceId: string;
  setOptimisticPosts: (action: {
    action: "add" | "delete" | "update";
    post: RouterOutputs["post"]["myPosts"][number];
  }) => void;
}

export const PostCard = ({ post, userName, workspaceId, setOptimisticPosts }: PostCardProps) => {
  const router = useRouter();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="line-clamp-2 text-base">{post.title}</CardTitle>
          <CardDescription className="line-clamp-1 text-sm">
            {userName ? <span>{userName} at </span> : null}
            {new Date(post.createdAt.toJSON()).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="line-clamp-3 text-sm">
          <div className="prose prose-sm max-h-[200px] max-w-[none] overflow-y-auto px-3 py-2 dark:prose-invert">
            <AnnouncementPreview text={post.content} />
          </div>
        </CardContent>
        <CardFooter className="flex-row-reverse gap-2">
          <Button variant="secondary" size="sm" className="w-full" asChild>
            <Link href={`/workspace/${workspaceId}/announcement/${post.id}`}>
              <ExternalLink className="mr-1 h-4 w-4" />
              <span>Open in New Tab</span>
            </Link>
          </Button>
          <EditAnnouncement
            workspaceId={workspaceId}
            post={post as RouterOutputs["post"]["get"]}
            setOptimisticPosts={setOptimisticPosts}
          />
          {/* <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => {
            startDeleteTransition(async () => {
              await postMutation.mutateAsync(
                { id: post.id },
                {
                  onSettled: () => {
                    setOptimisticPosts({
                      action: "delete",
                      post,
                    });
                  },
                  onSuccess: () => {
                    toast.success("Post deleted");
                    router.refresh();
                  },
                  onError: () => {
                    toast.error("Failed to delete post");
                  },
                },
              );
            });
          }}
          disabled={isDeletePending}
        >
          <TrashIcon className="h-5 w-5" />
          <span className="sr-only">Delete</span>
        </Button> */}
        </CardFooter>
      </Card>
    </>
  );
};
