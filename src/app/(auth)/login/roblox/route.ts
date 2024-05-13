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
    secure: true, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  cookies().set("code_verifier", codeVerifier, {
    secure: true, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  return Response.redirect(url);
}
