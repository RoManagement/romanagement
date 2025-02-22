import { CheckCircledIcon, ExclamationTriangleIcon, FilePlusIcon } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Key, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { LoadingButton } from "@/components/loading-button";
import { useFormState } from "react-dom";
import { createWorkspace } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface NewWorkspaceProps {
  isEligible: boolean;
}

export const NewWorkspaceCard = ({ isEligible }: NewWorkspaceProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleFormAction = async (state: any, payload: any) => {
    // Step 2: Capture the workspaceId from the createWorkspace function
    const result = await createWorkspace(state, isEligible, payload);
    if (result?.workspaceId) {
      return { ...state, success: true, workspaceId: result.workspaceId };
    }
    return { ...state, success: false };
  };

  const [state, formAction] = useFormState(handleFormAction, null);

  useEffect(() => {
    // Step 3: Use the workspaceId from state for routing
    if (state?.success && state.workspaceId) {
      toast("Workspace created successfully. Workspace ID: " + state.workspaceId, {
        icon: <CheckCircledIcon className="h-4 w-4" />,
      });
      router.refresh();
      setTimeout(() => {
        router.push(`/workspace/${state.workspaceId}`);
      }, 100);
    }
  }, [state, router]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
          asChild
        >
          <div className="flex flex-col items-center gap-4">
            <FilePlusIcon className="h-10 w-10" />
            <p className="text-sm">New Workspace</p>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Create Workspace</AlertDialogTitle>
          <AlertDialogDescription>
            Welcome! Here is where you create your workspace for your roblox group! You will need be
            able to add admins that can configure workspace settings after creation. Please enter
            your Roblox Group ID below. If you need help finding your group ID, please refer to the
            Roblox Developer Hub, or contact us for help.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Group ID</Label>
            <Input required placeholder="00000000" name="groupId" type="text" />
          </div>

          {state?.fieldError ? (
            <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err) => (
                <li className="ml-4" key={err as Key}>
                  {err as React.ReactNode}
                </li>
              ))}
            </ul>
          ) : state?.formError ? (
            <p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state?.formError}
            </p>
          ) : null}

          <SubmitButton className="w-full">Create Workspace</SubmitButton>
        </form>
        <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
