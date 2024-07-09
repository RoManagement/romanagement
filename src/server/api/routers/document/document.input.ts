import { title } from "process";
import { z } from "zod";

export const listDocumentsSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});
export type ListDocumentsInput = z.infer<typeof listDocumentsSchema>;

export const getDocumentSchema = z.object({
  id: z.string(),
});
export type GetDocumentInput = z.infer<typeof getDocumentSchema>;

export const createDocumentSchema = z.object({
  title: z.string().min(3).max(255),
  googleDocumentLink: z.string().url(),
  workspaceId: z.string(),
});
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = createDocumentSchema.extend({
  id: z.string(),
});
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export const deleteDocumentSchema = z.object({
  id: z.string(),
});
export type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>;

export const myDocumentsSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
  workspaceId: z.string(),
});
export type MyDocumentsInput = z.infer<typeof myDocumentsSchema>;
