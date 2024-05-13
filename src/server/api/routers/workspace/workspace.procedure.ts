import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./workspace.input";
import * as services from "./workspace.service";

export const workspaceRouter = createTRPCRouter({
  list: protectedProcedure
    .input(inputs.listWorkspacesSchema)
    .query(({ ctx, input }) => services.listWorkspaces(ctx, input)),

  get: protectedProcedure
    .input(inputs.getWorkspaceSchema)
    .query(({ ctx, input }) => services.getWorkspaces(ctx, input)),

  create: protectedProcedure
    .input(inputs.createWorkspaceSchema)
    .mutation(({ ctx, input }) => services.createWorkspaces(ctx, input)),

  update: protectedProcedure
    .input(inputs.updateWorkspaceSchema)
    .mutation(({ ctx, input }) => services.updateWorkspaces(ctx, input)),

  delete: protectedProcedure
    .input(inputs.deleteWorkspaceSchema)
    .mutation(async ({ ctx, input }) => services.deleteWorkspace(ctx, input)),

  myWorkspaces: protectedProcedure
    .input(inputs.myWorkspaceSchema)
    .query(({ ctx, input }) => services.myWorkspaces(ctx, input)),
});
