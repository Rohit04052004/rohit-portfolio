import { prisma } from "@/lib/prisma";

export async function getProfile() {
  return prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

export async function getContact() {
  return prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

export async function getResume() {
  return prisma.resume.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getTracks() {
  return prisma.track.findMany({ orderBy: { order: "asc" } });
}

export async function getTechStack() {
  return prisma.techStackItem.findMany({ orderBy: { order: "asc" } });
}
