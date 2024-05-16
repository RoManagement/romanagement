import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please provide your password.").max(255),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const setEmailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});
export type EmailInput = z.infer<typeof signupSchema>;

export const createWorkspaceSchema = z.object({
  groupId: z.string().min(2, { message: "Group ID is required!" }),
});
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password is too short. Minimum 8 characters required.").max(255),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid token"),
  password: z.string().min(8, "Password is too short").max(255),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const newPasswordSchema = z
  .object({
    password: z.string().min(1, "Invalid token"),
    newPassword: z.string().min(8, "Password is too short").max(255),
  });
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
