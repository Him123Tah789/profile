"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminProfilePage() {
  const [form, setForm] = useState({ name: "", headline: "", bio: "", photoUrl: "", location: "", email: "" });

  async function load() {
    const res = await fetch("/api/profile");
    const data = await res.json();
    if (data) setForm({ ...form, ...data });
  }

  async function save() {
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="grid gap-3 rounded-lg border bg-card p-4">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        <Input placeholder="Headline" value={form.headline} onChange={(e) => setForm((s) => ({ ...s, headline: e.target.value }))} />
        <Textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} />
        <Input placeholder="Photo URL" value={form.photoUrl} onChange={(e) => setForm((s) => ({ ...s, photoUrl: e.target.value }))} />
        <Input placeholder="Location" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} />
        <Input placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <Button onClick={save}>Save Profile</Button>
      </div>
    </div>
  );
}
