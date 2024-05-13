"use client";

import { FilePlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
interface NewWorkspaceProps {
  isEligible: boolean;
  setOptimisticWorkspaces: (action: {
    action: "add" | "delete" | "update";
    workspace: RouterOutputs["workspace"]["myWorkspaces"][number];
  }) => void;
}

export const NewWorkspace = ({ isEligible, setOptimisticWorkspaces }: NewWorkspaceProps) => {
  const router = useRouter();
  const workspace = api.workspace.create.useMutation();
  const [isCreatePending, startCreateTransaction] = React.useTransition();

  const createWorkspace = () => {
    if (!isEligible) {
      toast.message("You've reached the limit of workspaces for your current plan", {
        description: "Upgrade to create more workspaces",
      });
      return;
    }

    startCreateTransaction(async () => {
      await workspace.mutateAsync(
        {
          name: "Untitled Post",
          robloxGroupId: "Write your content here",
          logo: "",
          apiKey: "",
        },
        {
          onSettled: () => {
            setOptimisticWorkspaces({
              action: "add",
              workspace: {
                id: crypto.randomUUID(),
                name: "Untitled Workspace",
                robloxGroupId: "untitled workspace",
                apiKey: crypto.randomUUID(),
                logo: "",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          },
          onSuccess: ({ id }) => {
            toast.success("Workspace created");
            router.refresh();
            // This is a workaround for a bug in navigation because of router.refresh()
            setTimeout(() => {
              router.push(`/editor/${id}`);
            }, 100);
            
          },
          onError: () => {
            toast.error("Failed to create workspace");
          },
        },
      );
    });
  };

  return (
    <Button
      onClick={createWorkspace}
      className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
      disabled={isCreatePending}
    >
      <div className="flex flex-col items-center gap-4">
        <FilePlusIcon className="h-10 w-10" />
        <p className="text-sm">New Workspace</p>
      </div>
    </Button>
  );
};
