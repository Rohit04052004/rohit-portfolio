import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const trackUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  artist: z.string().optional(),
  coverUrl: z.string().nullable().optional(),
  fileUrl: z.string().min(1).optional(),
  order: z.number().int().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const trackId = Number(id);
  if (!Number.isInteger(trackId)) {
    return NextResponse.json({ error: "Invalid track id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = trackUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const track = await prisma.track.update({
      where: { id: trackId },
      data: parsed.data,
    });
    return NextResponse.json(track);
  } catch {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const trackId = Number(id);
  if (!Number.isInteger(trackId)) {
    return NextResponse.json({ error: "Invalid track id" }, { status: 400 });
  }

  try {
    await prisma.track.delete({ where: { id: trackId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }
}
