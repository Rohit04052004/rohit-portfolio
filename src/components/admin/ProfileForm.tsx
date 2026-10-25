"use client";

import { useState } from "react";

type Profile = {
  name: string;
  title: string;
  greeting: string;
  bio: string;
  learningGoals: string;
  skills: string;
  avatarUrl: string | null;
};

export default function ProfileForm({ initial }: { initial: Profile }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Failed to save profile");
      return;
    }
    setSavedAt(Date.now());
  }

  async function handleAvatarUpload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    if (!res.ok) {
      setError("Failed to upload image");
      return;
    }
    const { url } = await res.json();
    setForm((f) => ({ ...f, avatarUrl: url }));
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <h2 className="text-lg font-semibold text-white">Profile</h2>

      <Field label="Name">
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Field>

      <Field label="Title">
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </Field>

      <Field label="Greeting (shown above the big heading)">
        <input
          className={inputClass}
          value={form.greeting}
          onChange={(e) => setForm({ ...form, greeting: e.target.value })}
        />
      </Field>

      <Field label="Bio">
        <textarea
          className={inputClass}
          rows={4}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </Field>

      <Field label="Learning Goals (shown in the Notes app, one goal per line)">
        <textarea
          className={inputClass}
          rows={4}
          value={form.learningGoals}
          onChange={(e) => setForm({ ...form, learningGoals: e.target.value })}
        />
      </Field>

      <Field label="Skills (shown in Terminal's 'skills' command, one per line)">
        <textarea
          className={inputClass}
          rows={4}
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
        />
      </Field>

      <Field label="Avatar">
        <div className="flex items-center gap-3">
          {form.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatarUrl} alt="Avatar" className="h-12 w-12 rounded-full object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }}
            className="text-sm text-white/70"
          />
        </div>
      </Field>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50 w-fit"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
        {savedAt && <span className="text-xs text-green-300">Saved</span>}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-white/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-white/70">{label}</span>
      {children}
    </label>
  );
}
