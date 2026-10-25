"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Profile = {
  name: string;
  title: string;
  greeting: string;
  bio: string;
  learningGoals: string;
  skills: string;
};

type Contact = {
  email: string;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  techStack: string;
  imageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
};

type Resume = {
  fileUrl: string | null;
  fileName: string | null;
};

type PortfolioData = {
  profile: Profile;
  contact: Contact;
  projects: Project[];
  resume: Resume;
  loaded: boolean;
};

const defaultData: PortfolioData = {
  profile: {
    name: "Rohit",
    title: "Software Engineer",
    greeting: "Hey, welcome to my",
    bio: "",
    learningGoals: "",
    skills: "",
  },
  contact: { email: "", github: null, linkedin: null, twitter: null },
  projects: [],
  resume: { fileUrl: null, fileName: null },
  loaded: false,
};

const PortfolioDataContext = createContext<PortfolioData>(defaultData);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [profileRes, contactRes, projectsRes, resumeRes] = await Promise.all([
        fetch("/api/profile").then((r) => r.json()),
        fetch("/api/contact").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/resume").then((r) => r.json()),
      ]);

      if (cancelled) return;

      setData({
        profile: profileRes,
        contact: contactRes,
        projects: projectsRes,
        resume: resumeRes,
        loaded: true,
      });
    }

    load().catch(() => {
      if (!cancelled) setData((prev) => ({ ...prev, loaded: true }));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <PortfolioDataContext.Provider value={data}>{children}</PortfolioDataContext.Provider>;
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
