import { generateId } from "lucia";
import type { ProtectedTRPCContext } from "../../trpc";

import type {
    CreateDocumentInput,
    DeleteDocumentInput,
    GetDocumentInput,
    ListDocumentsInput,
    MyDocumentsInput,
    UpdateDocumentInput,
} from "./document.input";
import { documents } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const listDocuments = async (ctx: ProtectedTRPCContext, input: ListDocumentsInput) => {
    return ctx.db.query.documents.findMany({
        offset: (input.page - 1) * input.perPage,
        limit: input.perPage,
        orderBy: (table, { desc }) => desc(table.createdAt),
        columns: {
            id: true,
            title: true,
            googleDocumentLink: true,
            createdAt: true,
            workspaceId: true,
        },
        with: { user: { columns: { email: true } } },
    });
};

export const getDocument = async (ctx: ProtectedTRPCContext, { id }: GetDocumentInput) => {
    return ctx.db.query.documents.findFirst({
        where: (table, { eq }) => eq(table.id, id),
        with: { user: { columns: { email: true } } },
    });
};

export const createDocument = async (ctx: ProtectedTRPCContext, input: CreateDocumentInput) => {
    const id = generateId(15);

    await ctx.db.insert(documents).values({
        id,
        userId: ctx.user.id,
        title: input.title,
        googleDocumentLink: input.googleDocumentLink,
        workspaceId: input.workspaceId,
    });

    return { id };
};

export const updateDocument = async (ctx: ProtectedTRPCContext, input: UpdateDocumentInput) => {
    const [item] = await ctx.db
      .update(documents)
      .set({
        title: input.title,
        googleDocumentLink: input.googleDocumentLink,
        workspaceId: input.workspaceId,
      })
      .where(eq(documents.id, input.id))
      .returning();
  
    return item;
  };
  
  export const deleteDocument = async (ctx: ProtectedTRPCContext, { id }: DeleteDocumentInput) => {
    const [item] = await ctx.db.delete(documents).where(eq(documents.id, id)).returning();
    return item;
  };
  
  export const myDocuments = async (ctx: ProtectedTRPCContext, input: MyDocumentsInput) => {
    return ctx.db.query.documents.findMany({
      where: (table, { eq }) => eq(table.workspaceId, input.workspaceId),
      offset: (input.page - 1) * input.perPage,
      limit: input.perPage,
      orderBy: (table, { desc }) => desc(table.createdAt),
      columns: {
        id: true,
        title: true,
        googleDocumentLink: true,
        createdAt: true,
        workspaceId: true,
      },
    });
};