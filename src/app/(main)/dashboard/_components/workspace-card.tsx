"use client";

import { Pencil2Icon, TrashIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getGroupInfo } from "@/lib/roblox/utils";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { ReactivateButton } from "./reactivate-button";

interface WorkspaceCardProps {
  isEligible: boolean;
  workspace: RouterOutputs["workspace"]["myWorkspaces"][number];
  userName?: string;
  setOptimisticWorkspaces: (action: {
    action: "add" | "delete" | "update";
    workspace: RouterOutputs["workspace"]["myWorkspaces"][number];
  }) => void;
}

export const WorkspaceCard = async ({ workspace, isEligible }: WorkspaceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">
          <img
            src={workspace.logo ?? ""}
            alt={workspace.name ?? ""}
            className="mb-2 h-[45px] w-[45px]"
          />
          {workspace.name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-row-reverse gap-2">
        {workspace.status === "Inactive" ? (
          <ReactivateButton workspaceId={workspace.id} isEligible={isEligible} />
        ) : (
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/workspace/${workspace.id}`}>
              <Pencil2Icon className="mr-1 h-4 w-4" />
              <span>Open</span>
            </Link>
          </Button>
        )}
        {/* Delete Button */}
        {/* <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => {
            startDeleteTransition(async () => {
              await workspaceMutation.mutateAsync(
                { id: workspace.id },
                {
                  onSettled: () => {
                    setOptimisticWorkspaces({
                      action: "delete",
                      workspace,
                    });
                  },
                  onSuccess: () => {
                    toast.success("Workspace deleted");
                    router.refresh();
                  },
                  onError: () => {
                    toast.error("Failed to delete workspace");
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

        <Badge variant="outline" className="mr-auto rounded-lg capitalize">
          <span className={workspace.status === "Active" ? "text-green-500" : "text-red-500"}>
            {workspace.status}
          </span>
        </Badge>
      </CardFooter>
    </Card>
  );
};
