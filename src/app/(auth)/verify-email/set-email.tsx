"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { ExclamationTriangleIcon } from "@/components/icons";
import {
  logout,
  setEmail,
  resendVerificationEmail as resendEmail,
} from "@/lib/auth/actions";
import { SubmitButton } from "@/components/submit-button";

export const SetEmail = () => {
  const [setEmailState, setEmailAction] = useFormState(setEmail, null);
  const emailFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (setEmailState?.formError) {
      toast(setEmailState.formError, {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    }
  }, [setEmailState?.formError]);

  return (
    <div className="flex flex-col gap-2">
      <form ref={emailFormRef} action={setEmailAction}>
        <Label htmlFor="email">New Email</Label>
        <Input className="mt-2" type="text" id="email" name="email" required />
        <SubmitButton className="mt-4 w-full">Set</SubmitButton>
      </form>
    </div>
  );
};
