import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const trackSchema = z.object({
  title: z.string().min(1),
  artist: z.string().default(""),
  coverUrl: z.string().nullable().optional(),
  fileUrl: z.string().min(1),
  order: z.number().int().default(0),
});

export async function GET() {
  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(tracks);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const track = await prisma.track.create({ data: parsed.data });
  return NextResponse.json(track, { status: 201 });
}
