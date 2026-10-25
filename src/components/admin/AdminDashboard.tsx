"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import ProfileForm from "./ProfileForm";
import ContactForm from "./ContactForm";
import ResumeForm from "./ResumeForm";
import ProjectsManager, { type Project } from "./ProjectsManager";
import TracksManager, { type Track } from "./TracksManager";
import TechStackManager, { type TechStackItem } from "./TechStackManager";

type Tab = "projects" | "profile" | "resume" | "contact" | "music" | "techstack";

type Props = {
  profile: {
    name: string;
    title: string;
    greeting: string;
    bio: string;
    learningGoals: string;
    skills: string;
    avatarUrl: string | null;
  };
  contact: { email: string; linkedin: string | null; github: string | null; twitter: string | null; location: string | null };
  resume: { fileUrl: string | null; fileName: string | null };
  projects: Project[];
  tracks: Track[];
  techStack: TechStackItem[];
};

const TABS: { key: Tab; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "profile", label: "Profile" },
  { key: "resume", label: "Resume" },
  { key: "contact", label: "Contact" },
  { key: "music", label: "Music" },
  { key: "techstack", label: "Tech Stack" },
];

export default function AdminDashboard({ profile, contact, resume, projects, tracks, techStack }: Props) {
  const [tab, setTab] = useState<Tab>("projects");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ExternalLink size={14} /> View site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="flex gap-6 px-6">
        <nav className="flex w-40 shrink-0 flex-col gap-1 py-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-2 text-left text-sm ${
                tab === t.key ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 py-6">
          {tab === "projects" && <ProjectsManager initial={projects} />}
          {tab === "profile" && <ProfileForm initial={profile} />}
          {tab === "resume" && <ResumeForm initial={resume} />}
          {tab === "contact" && <ContactForm initial={contact} />}
          {tab === "music" && <TracksManager initial={tracks} />}
          {tab === "techstack" && <TechStackManager initial={techStack} />}
        </div>
      </div>
    </main>
  );
}
