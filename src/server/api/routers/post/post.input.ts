import { title } from "process";
import { z } from "zod";

export const listPostsSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});
export type ListPostsInput = z.infer<typeof listPostsSchema>;

export const getPostSchema = z.object({
  id: z.string(),
});
export type GetPostInput = z.infer<typeof getPostSchema>;

export const createPostSchema = z.object({
  title: z.string().min(3).max(255),
  excerpt: z.string().min(3).max(255),
  content: z.string().min(3),
  workspaceId: z.string(),
});
export type CreatePostInput = z.infer<typeof createPostSchema>;

export const createDocumentSchema = z.object({
  title: z.string().min(3).max(255),
  googleDocumentLink: z.string().url(),
  workspaceId: z.string(),
})
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

export const updatePostSchema = createPostSchema.extend({
  id: z.string(),
});
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const deletePostSchema = z.object({
  id: z.string(),
});
export type DeletePostInput = z.infer<typeof deletePostSchema>;

export const myPostsSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
  workspaceId: z.string(),
});
export type MyPostsInput = z.infer<typeof myPostsSchema>;
