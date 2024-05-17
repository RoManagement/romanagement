import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewAnnouncement } from "./new-announcement";
import { type RouterOutputs } from "@/trpc/shared";
import { PostCard } from "./post-card";

interface Props {
  workspaceId: string;
  promises: Promise<[RouterOutputs["post"]["myPosts"], RouterOutputs["stripe"]["getPlan"]]>;
}

export function WorkspaceAnnouncements({ workspaceId, promises }: Props) {
  const [posts, subscriptionPlan] = React.use(promises);

  const [optimisticPosts, setOptimisticPosts] = React.useOptimistic(
    posts,
    (
      state,
      {
        action,
        post,
      }: {
        action: "add" | "delete" | "update";
        post: RouterOutputs["post"]["myPosts"][number];
      },
    ) => {
      switch (action) {
        case "delete":
          return state.filter((p) => p.id !== post.id);
        case "update":
          return state.map((p) => (p.id === post.id ? post : p));
        default:
          return [...state, post];
      }
    },
  );

  return (
    <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold md:text-2xl">Announcements</h1>
      </div>
      <div className="flex justify-end">
        <NewAnnouncement workspaceId={workspaceId} setOptimisticPosts={setOptimisticPosts} />
      </div>
      <div
        className="flex w-full items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 text-center md:grid-cols-2 lg:grid-cols-3">
          {optimisticPosts.map((post) => (
            <PostCard key={post.id} post={post} setOptimisticPosts={setOptimisticPosts} />
          ))}
        </div>
      </div>
    </main>
  );
}
