import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../src/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Rohit",
      title: "Full-Stack Developer",
      greeting: "Hey, I'm Rohit! Welcome to my",
      bio: "I'm a full-stack developer who loves building clean, functional products from idea to deployment. This is mock placeholder bio text — replace it from the admin panel.",
      learningGoals:
        "- Ship projects end-to-end, from idea to deployment\n- Get better at system design and scaling decisions\n- Keep learning new frameworks and tools as the ecosystem evolves\n- Contribute to open source and share what I learn",
      skills: "React / Next.js\nTypeScript / JavaScript\nTailwind CSS\nNode.js\nSQL / Prisma\nREST APIs\nGit / GitHub\nDocker\nLinux",
      avatarUrl: null,
    },
  });

  await prisma.contact.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: "rohit@example.com",
      linkedin: "https://linkedin.com/in/rohit",
      github: "https://github.com/rohit",
      twitter: null,
      location: "Remote",
    },
  });

  await prisma.resume.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      fileUrl: null,
      fileName: null,
    },
  });

  const mockProjects = [
    {
      title: "E-Commerce Website Application",
      slug: "ecommerce-website-application",
      description:
        "A mock placeholder project. Replace with a real project from the admin panel — add a description, tech stack, screenshot, and links.",
      techStack: "React, Node.js, Stripe",
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/rohit/example",
      order: 1,
    },
    {
      title: "AI Resume Analyzer",
      slug: "ai-resume-analyzer",
      description:
        "A mock placeholder project. Replace with a real project from the admin panel — add a description, tech stack, screenshot, and links.",
      techStack: "Python, OpenAI API, FastAPI",
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/rohit/example",
      order: 2,
    },
    {
      title: "Food Delivery App",
      slug: "food-delivery-app",
      description:
        "A mock placeholder project. Replace with a real project from the admin panel — add a description, tech stack, screenshot, and links.",
      techStack: "React Native, Firebase",
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/rohit/example",
      order: 3,
    },
  ];

  for (const project of mockProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
