"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SocialForm = {
  github: string;
  linkedin: string;
  googleScholar: string;
  orcid: string;
  twitter: string;
  website: string;
};

export default function AdminSettingsPage() {
  const [social, setSocial] = useState<SocialForm>({ github: "", linkedin: "", googleScholar: "", orcid: "", twitter: "", website: "" });
  const [githubData, setGithubData] = useState<{ repos?: any[]; commits?: any[] }>({});
  const [indexing, setIndexing] = useState(false);
  const [indexMessage, setIndexMessage] = useState("");

  async function load() {
    const [socialRes, githubRes] = await Promise.all([fetch("/api/social-links"), fetch("/api/github")]);
    const socialData = await socialRes.json();
    const github = await githubRes.json();
    if (socialData) setSocial((s) => ({ ...s, ...socialData }));
    setGithubData(github || {});
  }

  async function save() {
    await fetch("/api/social-links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(social)
    });
    await load();
  }

  async function reindex() {
    setIndexing(true);
    setIndexMessage("");
    const res = await fetch("/api/admin/reindex", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setIndexMessage(`Re-indexed ${data.sources} knowledge sources.`);
    } else {
      setIndexMessage(data.error || "Failed to re-index knowledge.");
    }
    setIndexing(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Settings</h1>
        <div className="grid gap-3 rounded-lg border bg-card p-4">
          <Input placeholder="GitHub URL" value={social.github} onChange={(e) => setSocial((s) => ({ ...s, github: e.target.value }))} />
          <Input placeholder="LinkedIn URL" value={social.linkedin} onChange={(e) => setSocial((s) => ({ ...s, linkedin: e.target.value }))} />
          <Input placeholder="Google Scholar URL" value={social.googleScholar} onChange={(e) => setSocial((s) => ({ ...s, googleScholar: e.target.value }))} />
          <Input placeholder="ORCID URL" value={social.orcid} onChange={(e) => setSocial((s) => ({ ...s, orcid: e.target.value }))} />
          <Input placeholder="Twitter URL" value={social.twitter} onChange={(e) => setSocial((s) => ({ ...s, twitter: e.target.value }))} />
          <Input placeholder="Website URL" value={social.website} onChange={(e) => setSocial((s) => ({ ...s, website: e.target.value }))} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={save}>Save Links</Button>
            <Button variant="outline" onClick={reindex} disabled={indexing}>{indexing ? "Re-indexing..." : "Re-index knowledge"}</Button>
          </div>
          {indexMessage ? <p className="text-sm text-muted-foreground">{indexMessage}</p> : null}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-semibold">GitHub Preview</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="mb-2 font-medium">Pinned / Recent Repos</p>
            <ul className="space-y-1 text-sm">
              {(githubData.repos || []).map((repo: any) => <li key={repo.id}>{repo.name}</li>)}
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="mb-2 font-medium">Latest Commits</p>
            <ul className="space-y-1 text-sm">
              {(githubData.commits || []).map((c: any, i: number) => <li key={i}>{c.message}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
