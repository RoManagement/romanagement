import { z } from "zod";

export const listWorkspacesSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});
export type ListWorkspacesInput = z.infer<typeof listWorkspacesSchema>;

export const getWorkspaceSchema = z.object({
  id: z.string(),
});
export type GetWorkspaceInput = z.infer<typeof getWorkspaceSchema>;

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(255),
  robloxGroupId: z.string().max(255),
  logo: z.string().max(255),
  apiKey: z.string().max(255),
});
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = createWorkspaceSchema.extend({
  id: z.string(),
});
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

export const deleteWorkspaceSchema = z.object({
  id: z.string(),
});
export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspaceSchema>;

export const myWorkspaceSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});
export type MyWorkspaceInput = z.infer<typeof myWorkspaceSchema>;
