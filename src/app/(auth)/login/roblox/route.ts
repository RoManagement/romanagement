import { cookies } from "next/headers";
import { generateState, generateCodeVerifier } from "arctic";
import { roblox } from "@/lib/auth";
import { env } from "@/env";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await roblox.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile"],
  });

  cookies().set("state", state, {
    path: "/",
    //secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    //secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
