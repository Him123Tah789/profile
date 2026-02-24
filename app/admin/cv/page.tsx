"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/admin/file-uploader";

type CvItem = { id: string; fileUrl: string; version?: string | null; isActive: boolean; createdAt: string };

export default function AdminCvPage() {
  const [rows, setRows] = useState<CvItem[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [version, setVersion] = useState("");

  async function load() {
    const res = await fetch("/api/cv");
    const data = await res.json();
    setRows(data || []);
  }

  async function add() {
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl, version, isActive: true })
    });
    if (res.ok) {
      setFileUrl("");
      setVersion("");
      await load();
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CV</h1>
      <div className="rounded-lg border bg-card p-4">
        <div className="space-y-3">
          <Input placeholder="CV file URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
          <FileUploader onUploaded={setFileUrl} />
          <Input placeholder="Version (optional)" value={version} onChange={(e) => setVersion(e.target.value)} />
          <Button onClick={add}>Set Active CV</Button>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-md border p-3 text-sm">
            <p className="font-medium">{row.version || "Unnamed"} {row.isActive ? "(Active)" : ""}</p>
            <p className="text-muted-foreground">{row.fileUrl}</p>
            <Button className="mt-2" variant="destructive" onClick={() => remove(row.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
