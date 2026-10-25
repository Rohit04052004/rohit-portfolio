import { NextResponse } from "next/server";
import { getSessionRole } from "@/lib/auth";

export async function GET() {
  const role = await getSessionRole();
  return NextResponse.json({ role });
}
