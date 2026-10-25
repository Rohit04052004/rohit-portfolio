"use client";

import { useState } from "react";

type Contact = {
  email: string;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  location: string | null;
};

export default function ContactForm({ initial }: { initial: Contact }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Failed to save contact info");
      return;
    }
    setSavedAt(Date.now());
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <h2 className="text-lg font-semibold text-white">Contact</h2>

      <Field label="Email">
        <input
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </Field>

      <Field label="LinkedIn URL">
        <input
          className={inputClass}
          value={form.linkedin ?? ""}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value || null })}
        />
      </Field>

      <Field label="GitHub URL">
        <input
          className={inputClass}
          value={form.github ?? ""}
          onChange={(e) => setForm({ ...form, github: e.target.value || null })}
        />
      </Field>

      <Field label="Twitter / X URL">
        <input
          className={inputClass}
          value={form.twitter ?? ""}
          onChange={(e) => setForm({ ...form, twitter: e.target.value || null })}
        />
      </Field>

      <Field label="Location">
        <input
          className={inputClass}
          value={form.location ?? ""}
          onChange={(e) => setForm({ ...form, location: e.target.value || null })}
        />
      </Field>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50 w-fit"
        >
          {saving ? "Saving..." : "Save contact info"}
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
