"use client";

import { type RouterOutputs } from "@/trpc/shared";
import * as React from "react";
import { NewWorkspaceCard } from "./new-workspace-card";
interface NewWorkspaceProps {
  isEligible: boolean;
  setOptimisticWorkspaces: (action: {
    action: "add" | "delete" | "update";
    workspace: RouterOutputs["workspace"]["myWorkspaces"][number];
  }) => void;
}

export const NewWorkspace = ({ isEligible, setOptimisticWorkspaces }: NewWorkspaceProps) => {

  return (
    <NewWorkspaceCard isEligible={isEligible} />
  );
};
