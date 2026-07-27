"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/uploadImage";

export default function CoverImage({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined | null) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  if (value) {
    return (
      <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Cover" className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-3 top-3 rounded bg-black/60 px-3 py-1 text-sm text-white transition-colors hover:bg-black/80"
        >
          Remove cover
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        void handleFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className="mb-10 flex aspect-[16/9] w-full cursor-pointer items-center justify-center border border-dashed border-rule text-center transition-colors hover:border-white/40"
    >
      <div>
        <p className="eyebrow">Cover image</p>
        <p className="mt-2 text-sm text-muted">
          {busy ? "Uploading…" : "Drag an image here, or click to choose"}
        </p>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
