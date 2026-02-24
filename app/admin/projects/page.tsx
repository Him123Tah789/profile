"use client";

import { CrudManager } from "@/components/admin/crud-manager";

export default function AdminProjectsPage() {
  return (
    <CrudManager
      title="Projects"
      endpoint="/api/projects"
      fields={[
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "techStack", label: "Tech Stack (comma-separated)" },
        { name: "githubLink", label: "GitHub URL" },
        { name: "liveLink", label: "Live URL" },
        { name: "images", label: "Image URLs (comma-separated)" },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "tags", label: "Tags (comma-separated)" },
        { name: "status", label: "Status (DRAFT/PUBLISHED)" }
      ]}
    />
  );
}
