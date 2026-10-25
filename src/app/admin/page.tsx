import { getProfile, getContact, getResume, getProjects, getTracks, getTechStack } from "@/lib/content";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [profile, contact, resume, projects, tracks, techStack] = await Promise.all([
    getProfile(),
    getContact(),
    getResume(),
    getProjects(),
    getTracks(),
    getTechStack(),
  ]);

  return (
    <AdminDashboard
      profile={profile}
      contact={contact}
      resume={resume}
      projects={projects}
      tracks={tracks}
      techStack={techStack}
    />
  );
}
