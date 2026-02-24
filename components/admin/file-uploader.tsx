"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FileUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (res.ok && data.url) {
      onUploaded(data.url);
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" onChange={handleChange} />
      <Button type="button" variant="outline" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</Button>
    </div>
  );
}
