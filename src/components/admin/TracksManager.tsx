"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X, Upload, Music } from "lucide-react";

export type Track = {
  id: number;
  title: string;
  artist: string;
  coverUrl: string | null;
  fileUrl: string;
  order: number;
};

const emptyDraft = {
  title: "",
  artist: "",
  coverUrl: null as string | null,
  fileUrl: "",
  order: 0,
};

export default function TracksManager({ initial }: { initial: Track[] }) {
  const [tracks, setTracks] = useState(initial);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setDraft({ ...emptyDraft, order: tracks.length });
    setEditingId("new");
    setError(null);
  }

  function startEdit(track: Track) {
    setDraft({
      title: track.title,
      artist: track.artist,
      coverUrl: track.coverUrl,
      fileUrl: track.fileUrl,
      order: track.order,
    });
    setEditingId(track.id);
    setError(null);
  }

  async function handleCoverUpload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    if (!res.ok) {
      setError("Failed to upload cover image");
      return;
    }
    const { url } = await res.json();
    setDraft((d) => ({ ...d, coverUrl: url }));
  }

  async function handleAudioUpload(file: File) {
    setUploadingAudio(true);
    setError(null);
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    setUploadingAudio(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "Failed to upload audio file");
      return;
    }
    const { url } = await res.json();
    setDraft((d) => ({ ...d, fileUrl: url }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/tracks" : `/api/tracks/${editingId}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(typeof data?.error === "string" ? data.error : "Failed to save track");
      return;
    }

    const saved = await res.json();
    setTracks((prev) =>
      isNew
        ? [...prev, saved].sort((a, b) => a.order - b.order)
        : prev.map((t) => (t.id === saved.id ? saved : t)).sort((a, b) => a.order - b.order)
    );
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this track?")) return;
    const res = await fetch(`/api/tracks/${id}`, { method: "DELETE" });
    if (res.ok) setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Music (Spotify app)</h2>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-white/90"
        >
          <Plus size={14} /> Add track
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3"
          >
            {track.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={track.coverUrl} alt="" className="h-10 w-10 rounded object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
                <Music size={16} className="text-white/50" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-white">{track.title}</p>
              <p className="text-xs text-white/50">{track.artist || "Unknown artist"}</p>
            </div>
            <button onClick={() => startEdit(track)} title="Edit">
              <Pencil size={16} className="text-white/60 hover:text-white" />
            </button>
            <button onClick={() => handleDelete(track.id)} title="Delete">
              <Trash2 size={16} className="text-white/60 hover:text-red-300" />
            </button>
          </div>
        ))}
        {tracks.length === 0 && (
          <p className="text-sm text-white/60">
            No tracks yet. Add one to replace the demo song in the Spotify app.
          </p>
        )}
      </div>

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/15 bg-neutral-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                {editingId === "new" ? "New track" : "Edit track"}
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

              <Field label="Artist">
                <input
                  className={inputClass}
                  value={draft.artist}
                  onChange={(e) => setDraft({ ...draft, artist: e.target.value })}
                />
              </Field>

              <Field label="Cover art">
                <div className="flex items-center gap-3">
                  {draft.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={draft.coverUrl} alt="" className="h-10 w-10 rounded object-cover" />
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
                        if (file) handleCoverUpload(file);
                      }}
                    />
                  </label>
                </div>
              </Field>

              <Field label="Audio file (MP3, WAV, OGG, or M4A)">
                <div className="flex items-center gap-3">
                  {draft.fileUrl && <Music size={16} className="text-green-400 shrink-0" />}
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
                    <Upload size={14} />
                    {uploadingAudio ? "Uploading..." : draft.fileUrl ? "Replace" : "Upload"}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAudioUpload(file);
                      }}
                    />
                  </label>
                </div>
              </Field>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                onClick={handleSave}
                disabled={saving || !draft.title || !draft.fileUrl}
                className="mt-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save track"}
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
