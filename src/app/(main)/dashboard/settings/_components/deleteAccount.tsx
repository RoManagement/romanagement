"use client";;
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAccountAlert } from "./deleteAccountAlert";

interface Props {
  user: any;
}

export const DeleteAccount = ({ user }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Deleting your account will remove all your data from our servers, this includes all
          workspaces that you own, you must cancel your pro plan before deleting if applicable. This
          action is irreversible. There is a confirmation step to prevent accidental deletion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DeleteAccountAlert user={user} />
      </CardContent>
    </Card>
  );
};
