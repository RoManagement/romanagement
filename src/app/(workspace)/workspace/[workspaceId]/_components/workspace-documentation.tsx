import { Button } from "@/components/ui/button";

export const WorkspaceDocumentation = () => {
  return (
    <main className="flex flex-col gap-4 px-2 py-4 lg:gap-6 lg:px-4 lg:py-6">
      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold md:text-2xl">Documentation</h1>
      </div>
      <div className="flex justify-end">
        <Button
          className="flex cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
          asChild
        >
          <div className="flex flex-col items-center">
            <p className="text-sm">Add Documentation</p>
          </div>
        </Button>
      </div>
      <div className="w-full rounded-lg border p-2 shadow-sm" x-chunk="dashboard-02-chunk-1">
        <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 text-center md:grid-cols-2 lg:grid-cols-3">
          {""}
        </div>
        <div className="flex items-center justify-center">No Documentation</div>
      </div>
    </main>
  );
};
