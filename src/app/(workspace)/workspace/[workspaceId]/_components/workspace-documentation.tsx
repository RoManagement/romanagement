import * as React from "react";
import { NewAnnouncement } from "./new-announcement";
import { type RouterOutputs } from "@/trpc/shared";
import { PostCard } from "./post-card";
import { NewDocument } from "./new-document";

interface Props {
  workspaceId: string;
  promises: Promise<[RouterOutputs["post"]["myPosts"], RouterOutputs["stripe"]["getPlan"]]>;
}

export function WorkspaceDocumentation({ workspaceId, promises }: Props) {
  const [posts] = React.use(promises);

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
    <main className="flex flex-col gap-4 px-2 py-4 lg:gap-6 lg:px-4 lg:py-6">
      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold md:text-2xl">Workspace Documentation</h1>
      </div>
      <div className="flex justify-end">
        <NewDocument workspaceId={workspaceId} />
      </div>
      <div className="w-full rounded-lg border p-2 shadow-sm" x-chunk="dashboard-02-chunk-1">
        {optimisticPosts.length === 0 ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground">No documents available.</p>
          </div>
        ) : (
          <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 text-center md:grid-cols-2 lg:grid-cols-3">
            {optimisticPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                setOptimisticPosts={setOptimisticPosts}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
