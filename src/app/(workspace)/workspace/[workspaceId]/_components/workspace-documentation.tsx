import * as React from "react";
import { type RouterOutputs } from "@/trpc/shared";
import { DocumentCard } from "./document-card";
import { NewDocument } from "./new-document";

interface Props {
  workspaceId: string;
  promises: Promise<[RouterOutputs["document"]["myDocuments"], RouterOutputs["stripe"]["getPlan"]]>;
}

export function WorkspaceDocumentation({ workspaceId, promises }: Props) {
  const [documents] = React.use(promises);

  const [optimisticDocuments, setOptimisticDocuments] = React.useOptimistic(
    documents,
    (
      state,
      {
        action,
        document,
      }: {
        action: "add" | "delete" | "update";
        document: RouterOutputs["document"]["myDocuments"][number];
      },
    ) => {
      switch (action) {
        case "delete":
          return state.filter((p) => p.id !== document.id);
        case "update":
          return state.map((p) => (p.id === document.id ? document : p));
        default:
          return [...state, document];
      }
    },
  );

  return (
    <main className="flex flex-col gap-4 px-2 py-4 lg:gap-6 lg:px-4 lg:py-6">
      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold md:text-2xl">Workspace Documentation</h1>
      </div>
      <div className="flex justify-end">
        <NewDocument workspaceId={workspaceId} setOptimisticDocuments={setOptimisticDocuments} />
      </div>
      <div className="w-full rounded-lg border p-2 shadow-sm" x-chunk="dashboard-02-chunk-1">
        {optimisticDocuments.length === 0 ? (
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground">No documents available.</p>
          </div>
        ) : (
          <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 text-center md:grid-cols-2 lg:grid-cols-3">
            {optimisticDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                setOptimisticDocuments={setOptimisticDocuments}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
