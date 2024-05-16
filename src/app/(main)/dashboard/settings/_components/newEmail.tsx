"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { ExclamationTriangleIcon } from "@/components/icons";
import { logout, setEmail, resendVerificationEmail as resendEmail } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  user: any;
}

export const NewEmail = ({user}: Props) => {
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
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Used to reset password and login using password. You will be required to re-verify your
          email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={emailFormRef} action={setEmailAction} className="space-y-4">
          <Label htmlFor="email">New Email</Label>
          <Input className="mt-2" type="text" id="email" name="email" placeholder={user.email ?? ""} required />
          <SubmitButton className="px-6 py-4">Set</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
};
