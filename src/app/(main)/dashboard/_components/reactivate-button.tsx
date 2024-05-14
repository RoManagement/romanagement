import React, { useState } from "react";
import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { Paths } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@/components/icons";
import { reactivateWorkspace } from "@/lib/auth/actions";
import { LoadingButton } from "@/components/loading-button";

interface Props {
  workspaceId: string;
}

export const ReactivateButton = ({ workspaceId }: Props) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReactivation = async () => {
    setIsLoading(true);
    try {
      await reactivateWorkspace(workspaceId, true);
      toast("Reactivated Workspace Successfully. Workspace ID: " + workspaceId, {
        icon: <CheckCircledIcon className="h-4 w-4" />,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toast(error.message, {
          icon: <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />,
        });
        return; // Add this line to prevent the success message from showing
      }
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="secondary" size="sm" asChild>
          <span>ReActivate</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">ReActivate Workspace</AlertDialogTitle>
          <AlertDialogDescription>
            Welcome! This workspace was either deactivated by you or by an admin. You can
            reactivate, but please note that any configuration changes made before the workspace was
            deactivated will be lost unless it was deactivated because your pro plan ended. Are you
            sure you want to reactivate this workspace?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <LoadingButton loading={isLoading} onClick={handleReactivation} className="w-full">
            ReActivate
          </LoadingButton>
          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
