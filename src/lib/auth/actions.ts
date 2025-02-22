"use server";

/* eslint @typescript-eslint/no-explicit-any:0, @typescript-eslint/prefer-optional-chain:0 */

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateId, Scrypt } from "lucia";
import { isWithinExpirationDate, TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { db } from "@/server/db";
import {
  loginSchema,
  setEmailSchema,
  createWorkspaceSchema,
  newPasswordSchema,
  deleteAccountSchema,
  type DeleteAccountInput,
  type NewPasswordInput,
  type CreateWorkspaceInput,
  type LoginInput,
  type EmailInput,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { admins, emailVerificationCodes, passwordResetTokens, users, workspaces, workspaceUsers } from "@/server/db/schema";
import { sendMail, EmailTemplate } from "@/lib/email";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "../constants";
import { env } from "@/env";
import { getGroupInfo, getGroupLogo } from "../roblox/utils";
import { group } from "console";
import { api } from "@/trpc/server";

export async function deleteAccount(_: any, formData: FormData): Promise<ActionResponse<DeleteAccountInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = deleteAccountSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        robloxId: err.fieldErrors.robloxId?.[0],
      },
    };
  }

  const { robloxId } = parsed.data;

  const { user, session } = await validateRequest();

  if (!user) {
    return redirect(Paths.Login);
  }

  const stripePlan = await api.stripe.getPlan.query();

  if (stripePlan?.isPro === true) {
    return {
      formError: "You must downgrade your plan before deleting your account. If you have already cancelled your subscription, please wait until the end of the billing period. If you have any issues, please contact support.",
    };
  }

  if (user.robloxId !== robloxId) {
    return {
      formError: "Invalid Roblox ID",
    };
  }

  await db.delete(users).where(eq(users.id, user.id));
  await db.delete(workspaceUsers).where(eq(workspaceUsers.userId, user.id));
  await db.delete(workspaces).where(eq(workspaces.ownerId, user.id));
  await db.delete(admins).where(eq(admins.userId, user.id));

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  success?: string;
  workspaceId?: string;
}

export async function setNewPassword(_: any, formData: FormData): Promise<ActionResponse<NewPasswordInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = newPasswordSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { password, newPassword } = parsed.data;

  const { user } = await validateRequest();

  if (!user) {
    return redirect(Paths.Login);
  }

  if (!user.email) {
    return {
      formError: "User does not have an email, please set a new email to continue",
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, user.email ?? ""),
  });

  if (!existingUser?.hashedPassword) {
    return {
      formError: "User does not have a password set",
    };
  }

  const validPassword = await new Scrypt().verify(existingUser.hashedPassword, password);

  if (!validPassword) {
    return {
      formError: "Incorrect password, Please make sure you've entered the old password correctly.",
    };
  }

  const hashedPassword = await new Scrypt().hash(newPassword);

  await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id));

  return {
    success: "Password updated successfully!",
  };
}

export async function reactivateWorkspace(workspaceId: string, isEligible: boolean): Promise<void> {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("User not authenticated"); // Change this line
  }

  if (!isEligible) {
    throw new Error("You've reached the limit of workspaces for your current plan! Please upgrade to create more workspaces, or deactivate some."); // Change this line
  }

  const workspace = await db.query.workspaces.findFirst({
    where: (table, { eq }) => eq(table.id, workspaceId),
  });

  if (!workspace) {
    throw new Error("Workspace not found"); // Change this line
  }

  if (workspace.ownerId !== user.id) {
    throw new Error("You do not have permission to reactivate this workspace"); // Change this line
  }

  await db.update(workspaces).set({ status: "Active" }).where(eq(workspaces.id, workspaceId));
}

export async function createWorkspace(_: any, isEligible: any, formData: FormData): Promise<ActionResponse<CreateWorkspaceInput>> {
  const { user } = await validateRequest();

  if (!user) {
    return redirect(Paths.Login);
  }

  if (!isEligible) {
    return {
      formError: "You've reached the limit of workspaces for your current plan! Please upgrade to create more workspaces",
    };
  }

  const obj = Object.fromEntries(formData.entries());

  const parsed = createWorkspaceSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        groupId: err.fieldErrors.groupId?.[0],
      },
    };
  }

  const { groupId } = parsed.data;

  const groupData = await getGroupInfo(groupId);
  const groupLogo = await getGroupLogo(groupId);

  if (groupData === null) {
    return {
      formError: "Failed to load group data, please make sure you're using the correct group ID.",
    };
  }
  if (groupLogo === null) {
    return {
      formError: "Failed to load group data, please make sure you're using the correct group ID.",
    };
  }

  if (groupData.owner.id.toString() !== user.robloxId?.toString()) {
    return {
      formError: "You must be the owner of the group to create a workspace",
    };
  }

  const existingWorkspace = await db.query.workspaces.findFirst({
    where: (table, { eq}) => eq(table.robloxGroupId, groupId),
  })

  if (existingWorkspace) {
    return {
      formError: "Workspace already exists",
    };
  }

  const workspaceId = generateId(15);

  const workspace = await db.insert(workspaces).values({
    id: workspaceId,
    name: groupData.name,
    ownerId: user.id,
    robloxGroupId: groupId,
    logo: groupLogo,
    apiKey: generateId(25),
    robloxCookie: "",
  })

  if (!workspace) {
    return {
      formError: "Failed to create workspace",
    };
  }

  const workspaceUser = await db.insert(workspaceUsers).values({
    id: generateId(20),
    userId: user.id,
    workspaceId,
    role: "Owner",
  })

  if (!workspaceUser) {
    return {
      formError: "Failed to create workspace",
    };
  }

  return {
    success: "Workspace created successfully! You may close this dialog now.",
    workspaceId: workspaceId, // Include the workspaceId in the success response
  };
}

export async function login(_: any, formData: FormData): Promise<ActionResponse<LoginInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = loginSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!existingUser) {
    return {
      formError: "Incorrect email or password",
    };
  }

  if (!existingUser || !existingUser?.hashedPassword) {
    return {
      formError: "Incorrect email or password",
    };
  }

  const validPassword = await new Scrypt().verify(existingUser.hashedPassword, password);
  if (!validPassword) {
    return {
      formError: "Incorrect email or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect(Paths.Dashboard);
}

/* export async function signup(_: any, formData: FormData): Promise<ActionResponse<SignupInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = signupSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    columns: { email: true },
  });

  if (existingUser) {
    return {
      formError: "Cannot create account with that email",
    };
  }

  const userId = generateId(21);
  const hashedPassword = await new Scrypt().hash(password);
  await db.insert(users).values({
    id: userId,
    email,
    hashedPassword,
  });

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendMail(email, EmailTemplate.EmailVerification, { code: verificationCode });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect(Paths.VerifyEmail);
} */

export async function logout(): Promise<{ error: string } | void> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/");
}

export async function resendVerificationEmail(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const { user } = await validateRequest();
  if (!user) {
    return redirect(Paths.Login);
  }
  const lastSent = await db.query.emailVerificationCodes.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
    columns: { expiresAt: true },
  });

  if (lastSent && isWithinExpirationDate(lastSent.expiresAt)) {
    return {
      error: `Please wait ${timeFromNow(lastSent.expiresAt)} before resending`,
    };
  }
  const verificationCode = await generateEmailVerificationCode(user.id, user.email ?? "");
  await sendMail(user.email ?? "", EmailTemplate.EmailVerification, { code: verificationCode });

  return { success: true };
}

export async function setEmail(_: any, formData: FormData): Promise<ActionResponse<EmailInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = setEmailSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
      },
    };
  }

  const { email } = parsed.data;

  const { user } = await validateRequest();

  if (!user) {
    return redirect(Paths.Login);
  }

  const existingEmail = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (existingEmail) {
    return {
      formError: "Email is already in use",
    };
  }

  await db.update(users).set({ email, emailVerified: false }).where(eq(users.id, user.id));

  await resendVerificationEmail();
  return redirect(Paths.VerifyEmail);
}

export async function verifyEmail(_: any, formData: FormData): Promise<{ error: string } | void> {
  const code = formData.get("code");
  if (typeof code !== "string" || code.length !== 8) {
    return { error: "Invalid code" };
  }
  const { user } = await validateRequest();
  if (!user) {
    return redirect(Paths.Login);
  }

  const dbCode = await db.transaction(async (tx) => {
    const item = await tx.query.emailVerificationCodes.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
    });
    if (item) {
      await tx.delete(emailVerificationCodes).where(eq(emailVerificationCodes.id, item.id));
    }
    return item;
  });

  if (!dbCode || dbCode.code !== code) return { error: "Invalid verification code" };

  if (!isWithinExpirationDate(dbCode.expiresAt)) return { error: "Verification code expired" };

  if (dbCode.email !== user.email) return { error: "Email does not match" };

  await lucia.invalidateUserSessions(user.id);
  await db.update(users).set({ emailVerified: true }).where(eq(users.id, user.id));
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  redirect(Paths.Dashboard);
}

export async function sendPasswordResetLink(
  _: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email");
  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) {
    return { error: "Provided email is invalid." };
  }
  try {
    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, parsed.data),
    });

    if (!user || !user.emailVerified) return { error: "Provided email is invalid." };

    const verificationToken = await generatePasswordResetToken(user.id);

    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/reset-password/${verificationToken}`;

    await sendMail(user.email ?? "", EmailTemplate.PasswordReset, { link: verificationLink });

    return { success: true };
  } catch (error) {
    return { error: "Failed to send verification email." };
  }
}

export async function resetPassword(
  _: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = resetPasswordSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      error: err.fieldErrors.password?.[0] ?? err.fieldErrors.token?.[0],
    };
  }
  const { token, password } = parsed.data;

  const dbToken = await db.transaction(async (tx) => {
    const item = await tx.query.passwordResetTokens.findFirst({
      where: (table, { eq }) => eq(table.id, token),
    });
    if (item) {
      await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, item.id));
    }
    return item;
  });

  if (!dbToken) return { error: "Invalid password reset link" };

  if (!isWithinExpirationDate(dbToken.expiresAt)) return { error: "Password reset link expired." };

  await lucia.invalidateUserSessions(dbToken.userId);
  const hashedPassword = await new Scrypt().hash(password);
  await db.update(users).set({ hashedPassword }).where(eq(users.id, dbToken.userId));
  const session = await lucia.createSession(dbToken.userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  redirect(Paths.Dashboard);
}

const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};

async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
  await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, userId));
  const code = generateRandomString(8, alphabet("0-9")); // 8 digit code
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(10, "m")), // 10 minutes
  });
  return code;
}

async function generatePasswordResetToken(userId: string): Promise<string> {
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
  const tokenId = generateId(40);
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: createDate(new TimeSpan(2, "h")),
  });
  return tokenId;
}

export async function getIsAdmin(userId: string): Promise<boolean> {
  const admin = await db.query.admins.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });

  if (!admin) {
    return false;
  }

  return true;
}