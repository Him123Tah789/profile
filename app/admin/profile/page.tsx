"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminProfilePage() {
  const [form, setForm] = useState({ name: "", headline: "", bio: "", photoUrl: "", location: "", email: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data && !data.error) {
        setForm(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function save(overriddenForm?: any) {
    const payload = overriddenForm || form;
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (!overriddenForm) alert("Profile saved successfully!");
      } else {
        const err = await res.json();
        alert("Failed to save: " + JSON.stringify(err));
      }
      await load();
    } catch (e) {
      console.error(e);
      alert("Network error while saving.");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        const updatedForm = { ...form, photoUrl: data.url };
        setForm(updatedForm);

        // INSTANTLY SAVE TO DATABASE WITH THE NEW OBJECT, NOT RELYING ON REACT STATE TIMING
        await save(updatedForm);

        alert("Photo uploaded and saved successfully!");
      } else {
        alert("File upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <div className="grid gap-6 rounded-xl border bg-card p-6 shadow-sm">

        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Picture</label>
          <div className="flex items-center gap-4">
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground border-2 border-dashed">No Photo</div>
            )}
            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </Button>
                {form.photoUrl && (
                  <Button variant="ghost" size="sm" onClick={() => setForm(s => ({ ...s, photoUrl: "" }))} className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-medium mt-2">Personal Information</label>
          <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Input placeholder="Email Address" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <Input placeholder="Headline" value={form.headline} onChange={(e) => setForm((s) => ({ ...s, headline: e.target.value }))} />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} />
          <Textarea placeholder="Bio" value={form.bio} className="min-h-[150px]" onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} />
        </div>

        <Button onClick={() => save()} className="w-max px-8">Save Profile</Button>
      </div>
    </div>
  );
}
