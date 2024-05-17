"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiRoblox } from "react-icons/si";
import { APP_TITLE } from "@/lib/constants";

export function Signup() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{APP_TITLE} Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login/roblox">
            <SiRoblox className="mr-2 h-5 w-5" />
            Sign up with Roblox
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
