"use client";

import { type RouterOutputs } from "@/trpc/shared";
import * as React from "react";
import { NewWorkspaceCard } from "./new-workspace-card";
interface NewWorkspaceProps {
  isEligible: boolean;
}

export const NewWorkspace = ({ isEligible }: NewWorkspaceProps) => {

  return (
    <NewWorkspaceCard isEligible={isEligible} />
  );
};
