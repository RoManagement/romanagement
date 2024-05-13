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
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

interface WorkspaceCardProps {
  workspace: RouterOutputs["workspace"]["myWorkspaces"][number];
  userName?: string;
  setOptimisticWorkspaces: (action: {
    action: "add" | "delete" | "update";
    workspace: RouterOutputs["workspace"]["myWorkspaces"][number];
  }) => void;
}

export const WorkspaceCard = ({
  workspace,
  userName,
  setOptimisticWorkspaces,
}: WorkspaceCardProps) => {
  const router = useRouter();
  const workspaceMutation = api.workspace.delete.useMutation();
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">{workspace.name}</CardTitle>
        <CardDescription className="line-clamp-1 text-sm">
          {userName ? <span>{userName} at</span> : null}
          {new Date(workspace.createdAt.toJSON()).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="line-clamp-3 text-sm">{workspace.robloxGroupId}</CardContent>
      <CardFooter className="flex-row-reverse gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/editor/${workspace.id}`}>
            <Pencil2Icon className="mr-1 h-4 w-4" />
            <span>Edit</span>
          </Link>
        </Button>
        <Button
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
        </Button>
        <Badge variant="outline" className="mr-auto rounded-lg capitalize">
          {workspace.id}
        </Badge>
      </CardFooter>
    </Card>
  );
};
