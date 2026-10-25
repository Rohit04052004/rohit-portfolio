"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Upload, Code2 } from "lucide-react";

export type TechStackItem = {
  id: number;
  name: string;
  logoUrl: string | null;
  order: number;
};

const emptyDraft = {
  name: "",
  logoUrl: null as string | null,
  order: 0,
};

export default function TechStackManager({ initial }: { initial: TechStackItem[] }) {
  const [items, setItems] = useState(initial);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setDraft({ ...emptyDraft, order: items.length });
    setEditingId("new");
    setError(null);
  }

  function startEdit(item: TechStackItem) {
    setDraft({ name: item.name, logoUrl: item.logoUrl, order: item.order });
    setEditingId(item.id);
    setError(null);
  }

  async function handleLogoUpload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    if (!res.ok) {
      setError("Failed to upload logo");
      return;
    }
    const { url } = await res.json();
    setDraft((d) => ({ ...d, logoUrl: url }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/tech-stack" : `/api/tech-stack/${editingId}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(typeof data?.error === "string" ? data.error : "Failed to save tech stack item");
      return;
    }

    const saved = await res.json();
    setItems((prev) =>
      isNew
        ? [...prev, saved].sort((a, b) => a.order - b.order)
        : prev.map((i) => (i.id === saved.id ? saved : i)).sort((a, b) => a.order - b.order)
    );
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this tech stack item?")) return;
    const res = await fetch(`/api/tech-stack/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Tech Stack (desktop widget)</h2>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-white/90"
        >
          <Plus size={14} /> Add tech
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3"
          >
            {item.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.logoUrl} alt="" className="h-10 w-10 rounded object-contain bg-white/10 p-1" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
                <Code2 size={16} className="text-white/50" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-white">{item.name}</p>
            </div>
            <button onClick={() => startEdit(item)} title="Edit">
              <Pencil size={16} className="text-white/60 hover:text-white" />
            </button>
            <button onClick={() => handleDelete(item.id)} title="Delete">
              <Trash2 size={16} className="text-white/60 hover:text-red-300" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-white/60">
            No tech stack items yet. Add the tools/languages you use - they&apos;ll show up in the Tech Stack
            widget on the desktop.
          </p>
        )}
      </div>

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/15 bg-neutral-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                {editingId === "new" ? "New tech stack item" : "Edit tech stack item"}
              </h3>
              <button onClick={() => setEditingId(null)}>
                <X size={16} className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Field label="Name">
                <input
                  className={inputClass}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. React, TypeScript, Docker"
                />
              </Field>

              <Field label="Logo (optional - a placeholder icon is used if left blank)">
                <div className="flex items-center gap-3">
                  {draft.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.logoUrl} alt="" className="h-10 w-10 rounded object-contain bg-white/10 p-1" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
                      <Code2 size={16} className="text-white/50" />
                    </div>
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
                        if (file) handleLogoUpload(file);
                      }}
                    />
                  </label>
                </div>
              </Field>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                onClick={handleSave}
                disabled={saving || !draft.name}
                className="mt-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
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
