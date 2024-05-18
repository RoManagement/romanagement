import { ProtectedTRPCContext } from "../../trpc";
import { generateId } from "lucia";
import type {
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  GetWorkspaceInput,
  ListWorkspacesInput,
  MyWorkspaceInput,
  UpdateWorkspaceInput,
} from "./workspace.input";
import { workspaces, workspaceUsers, workspaceRelations, workspaceUserRelations } from "@/server/db/schema";
import { eq, or } from "drizzle-orm";

export const listWorkspaces = async (ctx: ProtectedTRPCContext, input: ListWorkspacesInput) => {
  return ctx.db.query.workspaces.findMany({
    offset: (input.page - 1) * input.perPage,
    limit: input.perPage,
    orderBy: (table, { desc }) => desc(table.createdAt),
    columns: {
      id: true,
      name: true,
      robloxGroupId: true,
      logo: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getWorkspaces = async (ctx: ProtectedTRPCContext, { id }: GetWorkspaceInput) => {
  return ctx.db.query.workspaces.findFirst({
    where: (table) => eq(table.id, id),
    columns: {
      id: true,
      name: true,
      robloxGroupId: true,
      logo: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
      ownerId: true,
      status: true,
    },
  });
};

export const createWorkspaces = async (ctx: ProtectedTRPCContext, input: CreateWorkspaceInput) => {
  const id = generateId(15);

  await ctx.db.insert(workspaces).values({
    id,
    name: input.name,
    ownerId: ctx.user.id,
    robloxGroupId: input.robloxGroupId,
    logo: input.logo,
    apiKey: crypto.randomUUID(),
    robloxCookie: "",
  });

  await ctx.db.insert(workspaceUsers).values({
    id: generateId(15),
    userId: ctx.user.id,
    workspaceId: id,
    role: "Owner",
  })

  return { id };
};

export const updateWorkspaces = async (ctx: ProtectedTRPCContext, input: UpdateWorkspaceInput) => {
  await ctx.db.update(workspaces).set({
    name: input.name,
    robloxGroupId: input.robloxGroupId,
    logo: input.logo,
    apiKey: input.apiKey,
  }).where(eq(workspaces.id, input.id));

  const updatedWorkspace = await ctx.db.query.workspaces.findFirst({
    where: (table) => eq(table.id, input.id),
    columns: {
      id: true,
      name: true,
      robloxGroupId: true,
      logo: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedWorkspace;
};

export const deleteWorkspace = async (ctx: ProtectedTRPCContext, { id }: DeleteWorkspaceInput) => {
  const deletedWorkspace = await ctx.db.delete(workspaces).where(eq(workspaces.id, id)).returning();
  await ctx.db.delete(workspaceUsers).where(eq(workspaceUsers.workspaceId, id));

  return deletedWorkspace;
};

export const myWorkspaces = async (ctx: ProtectedTRPCContext, input: MyWorkspaceInput) => {
  try {
    const userWorkspaces = await ctx.db.query.workspaceUsers.findMany({
      where: (table) => eq(table.userId, ctx.user.id),
      offset: (input.page - 1) * input.perPage,
      limit: input.perPage,
      columns: {
        workspaceId: true,
      },
    });

    const workspaceIds = userWorkspaces.map((userWorkspace) => userWorkspace.workspaceId);

    if (workspaceIds.length === 0) {
      return []; // Return an empty array since the user is not in any workspaces
    }

    const workspaces = await ctx.db.query.workspaces.findMany({
      where: (table) => {
        return or(
          ...workspaceIds.map((id) => eq(table.id, id))
        );
      },
      columns: {
        id: true,
        name: true,
        robloxGroupId: true,
        logo: true,
        apiKey: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        ownerId: true,
      },
    });

    return workspaces;
  } catch (error) {
    console.error("Error fetching my workspaces:", error);
    return []; // Return an empty array or handle the error as needed
  }
};