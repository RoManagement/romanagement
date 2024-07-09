import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./document.input";
import * as services from "./document.service";

export const documentRouter = createTRPCRouter({
  list: protectedProcedure
    .input(inputs.listDocumentsSchema)
    .query(({ ctx, input }) => services.listDocuments(ctx, input)),

  get: protectedProcedure
    .input(inputs.getDocumentSchema)
    .query(({ ctx, input }) => services.getDocument(ctx, input)),

  create: protectedProcedure
    .input(inputs.createDocumentSchema)
    .mutation(({ ctx, input }) => services.createDocument(ctx, input)),

  update: protectedProcedure
    .input(inputs.updateDocumentSchema)
    .mutation(({ ctx, input }) => services.updateDocument(ctx, input)),

  delete: protectedProcedure
    .input(inputs.deleteDocumentSchema)
    .mutation(async ({ ctx, input }) => services.deleteDocument(ctx, input)),

  myDocuments: protectedProcedure
    .input(inputs.myDocumentsSchema)
    .query(({ ctx, input }) => services.myDocuments(ctx, input)),
});
