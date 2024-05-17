import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Key, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { useFormState } from "react-dom";
import { deleteAccount } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  user: any;
}

export const DeleteAccountAlert = ({ user }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(deleteAccount, null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="space-y-4">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>
          <Button
          className=""
          variant="destructive"
          disabled={user.stripeSubscriptionId === null}
          asChild
        >
          <div className="flex flex-col items-center gap-4">
            Delete Account
          </div>
        </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Warning! Deleting your account will remove all your data from our servers, this includes all workspaces that you own, you must cancel your pro plan before deleting if applicable. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Roblox ID</Label>
            <Input required placeholder={user?.robloxId} name="robloxId" type="text" />
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

          <SubmitButton className="w-full" variant="destructive">Delete Account</SubmitButton>
        </form>

          <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
