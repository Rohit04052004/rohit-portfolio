import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const techStackSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

export async function GET() {
  const items = await prisma.techStackItem.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = techStackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.techStackItem.create({ data: parsed.data });
  return NextResponse.json(item, { status: 201 });
}
