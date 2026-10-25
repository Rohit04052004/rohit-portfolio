"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Upload } from "lucide-react";

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  techStack: string;
  imageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  order: number;
};

const emptyDraft = {
  title: "",
  slug: "",
  description: "",
  techStack: "",
  imageUrl: null as string | null,
  liveUrl: "",
  repoUrl: "",
  order: 0,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectsManager({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setDraft({ ...emptyDraft, order: projects.length });
    setEditingId("new");
    setError(null);
  }

  function startEdit(project: Project) {
    setDraft({
      title: project.title,
      slug: project.slug,
      description: project.description,
      techStack: project.techStack,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl ?? "",
      repoUrl: project.repoUrl ?? "",
      order: project.order,
    });
    setEditingId(project.id);
    setError(null);
  }

  async function handleImageUpload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    if (!res.ok) {
      setError("Failed to upload image");
      return;
    }
    const { url } = await res.json();
    setDraft((d) => ({ ...d, imageUrl: url }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      liveUrl: draft.liveUrl || null,
      repoUrl: draft.repoUrl || null,
    };

    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/projects" : `/api/projects/${editingId}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(typeof data?.error === "string" ? data.error : "Failed to save project");
      return;
    }

    const saved = await res.json();
    setProjects((prev) =>
      isNew
        ? [...prev, saved].sort((a, b) => a.order - b.order)
        : prev.map((p) => (p.id === saved.id ? saved : p)).sort((a, b) => a.order - b.order)
    );
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-white/90"
        >
          <Plus size={14} /> Add project
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3"
          >
            {project.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
            )}
            <div className="flex-1">
              <p className="text-sm text-white">{project.title}</p>
              <p className="text-xs text-white/50">/{project.slug}</p>
            </div>
            <button onClick={() => startEdit(project)} title="Edit">
              <Pencil size={16} className="text-white/60 hover:text-white" />
            </button>
            <button onClick={() => handleDelete(project.id)} title="Delete">
              <Trash2 size={16} className="text-white/60 hover:text-red-300" />
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-white/60">No projects yet. Add your first one.</p>
        )}
      </div>

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/15 bg-neutral-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                {editingId === "new" ? "New project" : "Edit project"}
              </h3>
              <button onClick={() => setEditingId(null)}>
                <X size={16} className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Field label="Title">
                <input
                  className={inputClass}
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </Field>

              <Field label="Slug (URL-safe, auto-filled from title if left blank)">
                <input
                  className={inputClass}
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
                  placeholder={slugify(draft.title)}
                />
              </Field>

              <Field label="Description">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </Field>

              <Field label="Tech stack (comma-separated)">
                <input
                  className={inputClass}
                  value={draft.techStack}
                  onChange={(e) => setDraft({ ...draft, techStack: e.target.value })}
                />
              </Field>

              <Field label="Live URL">
                <input
                  className={inputClass}
                  value={draft.liveUrl}
                  onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })}
                />
              </Field>

              <Field label="Repo URL">
                <input
                  className={inputClass}
                  value={draft.repoUrl}
                  onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
                />
              </Field>

              <Field label="Screenshot">
                <div className="flex items-center gap-3">
                  {draft.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                  )}
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
                    <Upload size={14} />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </div>
              </Field>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                onClick={handleSave}
                disabled={saving || !draft.title}
                className="mt-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none focus:border-white/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-white/70">{label}</span>
      {children}
    </label>
  );
}
