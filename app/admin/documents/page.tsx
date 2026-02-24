"use client";

import { CrudManager } from "@/components/admin/crud-manager";

export default function AdminDocumentsPage() {
  return (
    <CrudManager
      title="Documents"
      endpoint="/api/documents"
      fields={[
        { name: "title", label: "Title" },
        { name: "category", label: "Category" },
        { name: "fileUrl", label: "File URL", type: "file" },
        { name: "visibility", label: "Visibility (PUBLIC/PRIVATE)" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "tags", label: "Tags (comma-separated)" },
        { name: "status", label: "Status (DRAFT/PUBLISHED)" }
      ]}
    />
  );
}
