import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function getSessionRole(): Promise<"admin" | "viewer"> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  return session?.role === "admin" ? "admin" : "viewer";
}

export async function isAdmin(): Promise<boolean> {
  return (await getSessionRole()) === "admin";
}

/** Returns a 401 NextResponse if the caller is not an admin, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
