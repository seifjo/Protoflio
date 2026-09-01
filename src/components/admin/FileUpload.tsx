"use client";

import { useCallback, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

type Props = {
  kind: "image" | "apk" | "pdf" | "profile" | "favicon";
  onUploaded: (result: {
    url: string;
    fileName?: string;
    fileSize?: string;
    width?: number | null;
    height?: number | null;
  }) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
};

export function FileUpload({
  kind,
  onUploaded,
  label = "Upload file",
  accept,
  multiple = false,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      setUploading(true);

      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        setProgress(
          list.length > 1 ? `Uploading ${i + 1} of ${list.length}…` : "Uploading…",
        );
        const form = new FormData();
        form.append("file", file);
        form.append("kind", kind);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Upload failed.");
          continue;
        }
        onUploaded({
          url: data.url,
          fileName: data.fileName,
          fileSize: data.fileSize,
          width: data.width,
          height: data.height,
        });
      }

      setUploading(false);
      setProgress("");
    },
    [kind, onUploaded],
  );

  return (
    <div
      className={`relative border border-dashed p-6 text-center transition-colors ${
        dragOver
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--line)]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!uploading) upload(e.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={uploading}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => e.target.files && upload(e.target.files)}
      />
      <div className="pointer-events-none">
        {uploading ? (
          <Loader2 className="mx-auto animate-spin text-[var(--accent)]" size={24} />
        ) : (
          <Upload className="mx-auto text-[var(--dim)]" size={24} />
        )}
        <p className="mt-3 text-sm text-[var(--muted)]">
          {progress || label}
        </p>
        <p className="mt-1 text-xs text-[var(--dim)]">
          Drag & drop or click to browse
        </p>
      </div>
    </div>
  );
}
