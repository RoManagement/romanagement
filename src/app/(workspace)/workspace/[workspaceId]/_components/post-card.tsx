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
import { NewAnnouncementPreview } from "./new-announcement-preview";
import { ExternalLink } from "lucide-react";

interface PostCardProps {
  post: RouterOutputs["post"]["myPosts"][number];
  userName?: string;
  setOptimisticPosts: (action: {
    action: "add" | "delete" | "update";
    post: RouterOutputs["post"]["myPosts"][number];
  }) => void;
}

export const PostCard = ({ post, userName, setOptimisticPosts }: PostCardProps) => {
  const router = useRouter();

  console.log(post);

  return (
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
          <NewAnnouncementPreview text={post.content} />
        </div>
      </CardContent>
      <CardFooter className="flex-row-reverse gap-2">
        <Button variant="secondary" size="sm" className="w-full" asChild>
          <Link href={`/editor/${post.id}`}>
            <ExternalLink className="mr-1 h-4 w-4" />
            <span>Open in New Tab</span>
          </Link>
        </Button>
        <Button variant="secondary" size="sm" className="w-full" asChild>
          <Link href={`/editor/${post.id}`}>
            <Pencil2Icon className="mr-1 h-4 w-4" />
            <span>Edit</span>
          </Link>
        </Button>
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
  );
};
