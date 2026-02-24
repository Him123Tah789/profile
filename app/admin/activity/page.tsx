"use client";

import { CrudManager } from "@/components/admin/crud-manager";

export default function AdminActivityPage() {
  return (
    <CrudManager
      title="Activity / Posts"
      endpoint="/api/posts"
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "coverImage", label: "Cover Image URL" },
        { name: "content", label: "Content", type: "richtext" },
        { name: "tags", label: "Tags (comma-separated)" },
        { name: "status", label: "Status (DRAFT/PUBLISHED)" }
      ]}
    />
  );
}
