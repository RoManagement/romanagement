"use client";

import { type RouterOutputs } from "@/trpc/shared";
import * as React from "react";
import { NewWorkspace } from "./new-workspace";
import { WorkspaceCard } from "./workspace-card";

interface WorkspacesProps {
  promises: Promise<
    [RouterOutputs["workspace"]["myWorkspaces"], RouterOutputs["stripe"]["getPlan"]]
  >;
}

export function Workspaces({ promises }: WorkspacesProps) {
  /**
   * use is a React Hook that lets you read the value of a resource like a Promise or context.
   * @see https://react.dev/reference/react/use
   */
  const [workspaces, subscriptionPlan] = React.use(promises);

  /**
   * useOptimistic is a React Hook that lets you show a different state while an async action is underway.
   * It accepts some state as an argument and returns a copy of that state that can be different during the duration of an async action such as a network request.
   * @see https://react.dev/reference/react/useOptimistic
   */
  const [optimisticWorkspaces, setOptimisticWorkspaces] = React.useOptimistic(
    workspaces,
    (
      state,
      {
        action,
        workspace,
      }: {
        action: "add" | "delete" | "update";
        workspace: RouterOutputs["workspace"]["myWorkspaces"][number];
      },
    ) => {
      switch (action) {
        case "delete":
          return state.filter((p) => p.id !== workspace.id);
        case "update":
          return state.map((p) => (p.id === workspace.id ? workspace : p));
        default:
          return [...state, workspace];
      }
    },
  );

  const isEligible = (subscriptionPlan?.isPro ?? false) || optimisticWorkspaces.length < 2;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NewWorkspace isEligible={isEligible} setOptimisticWorkspaces={setOptimisticWorkspaces} />
      {optimisticWorkspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          setOptimisticWorkspaces={setOptimisticWorkspaces}
        />
      ))}
    </div>
  );
}
