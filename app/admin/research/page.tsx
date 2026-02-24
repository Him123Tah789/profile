"use client";

import { CrudManager } from "@/components/admin/crud-manager";

export default function AdminResearchPage() {
  return (
    <CrudManager
      title="Research / Papers"
      endpoint="/api/papers"
      fields={[
        { name: "title", label: "Title" },
        { name: "authors", label: "Authors (comma-separated)" },
        { name: "venue", label: "Venue" },
        { name: "year", label: "Year", type: "number" },
        { name: "abstract", label: "Abstract", type: "textarea" },
        { name: "pdfLink", label: "PDF URL", type: "file" },
        { name: "codeLink", label: "Code URL" },
        { name: "citations", label: "Citations", type: "number" },
        { name: "tags", label: "Tags (comma-separated)" },
        { name: "status", label: "Status (DRAFT/PUBLISHED)" }
      ]}
    />
  );
}
