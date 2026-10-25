import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  greeting: z.string().min(1).optional(),
  bio: z.string().optional(),
  learningGoals: z.string().optional(),
  skills: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export async function GET() {
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.profile.update({
    where: { id: 1 },
    data: parsed.data,
  });
  return NextResponse.json(profile);
}
