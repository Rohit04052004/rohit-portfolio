import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const resumeSchema = z.object({
  fileUrl: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
});

export async function GET() {
  const resume = await prisma.resume.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json(resume);
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = resumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const resume = await prisma.resume.update({
    where: { id: 1 },
    data: parsed.data,
  });
  return NextResponse.json(resume);
}
