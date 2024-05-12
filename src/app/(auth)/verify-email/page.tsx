import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { SetEmail } from "./set-email";
import { VerifyCode } from "./verify-code";
import { Paths } from "@/lib/constants";

export const metadata = {
  title: "Verify Email",
  description: "Verify Email Page",
};

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();

  if (!user) redirect(Paths.Login);
  if (user.emailVerified) redirect(Paths.Dashboard);

  return (
    <div>
      {user.email == null ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify Email</CardTitle>
            <CardDescription>
              You are required to have an email on file incase you lose access to your account or
              need to reset your password. Please verify your account to access all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetEmail />
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify Email</CardTitle>
            <CardDescription>
              Verification code was sent to <strong>{user.email}</strong>. Check your spam folder if
              you can't find the email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerifyCode />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
