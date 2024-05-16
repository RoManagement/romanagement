"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { ExclamationTriangleIcon } from "@/components/icons";
import { setNewPassword } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";

export const NewPassword = () => {
  const [setPasswordState, setPasswordAction] = useFormState(setNewPassword, null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (setPasswordState?.formError) {
      toast(setPasswordState.formError, {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
      });
    }
    if (setPasswordState?.success) {
      passwordFormRef.current?.reset();
      toast("Password updated successfully", { icon: <CheckCircleIcon className="h-5 w-5 text-success" /> });
    }
  }, [setPasswordState?.formError]);

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Used to login to your account, you must enter your old password to set a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={passwordFormRef} action={setPasswordAction} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="password">Old Password</Label>
            <Input className="mt-2" type="password" id="password" name="password" placeholder="********" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input className="mt-2" type="password" id="newPassword" name="newPassword" placeholder="********" required />
          </div>
          <SubmitButton className="px-6 py-4">Set</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
};
