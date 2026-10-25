"use client";

import { useState } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";

type Resume = {
  fileUrl: string | null;
  fileName: string | null;
};

export default function ResumeForm({ initial }: { initial: Resume }) {
  const [resume, setResume] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    const data = new FormData();
    data.append("file", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: data });

    if (!uploadRes.ok) {
      setUploading(false);
      setError("Failed to upload file");
      return;
    }

    const { url } = await uploadRes.json();

    const patchRes = await fetch("/api/resume", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl: url, fileName: file.name }),
    });

    setUploading(false);

    if (!patchRes.ok) {
      setError("Failed to save resume");
      return;
    }

    setResume({ fileUrl: url, fileName: file.name });
  }

  async function handleRemove() {
    const res = await fetch("/api/resume", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl: null, fileName: null }),
    });
    if (res.ok) setResume({ fileUrl: null, fileName: null });
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <h2 className="text-lg font-semibold text-white">Resume</h2>

      {resume.fileUrl ? (
        <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3">
          <FileText size={18} className="text-white/70" />
          <a
            href={resume.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-sm text-white hover:underline"
          >
            {resume.fileName ?? "resume.pdf"}
          </a>
          <button onClick={handleRemove} title="Remove">
            <Trash2 size={16} className="text-white/50 hover:text-red-300" />
          </button>
        </div>
      ) : (
        <p className="text-sm text-white/60">No resume uploaded yet.</p>
      )}

      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
        <Upload size={16} />
        {uploading ? "Uploading..." : "Upload PDF"}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}
