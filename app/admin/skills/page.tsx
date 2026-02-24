"use client";

import { CrudManager } from "@/components/admin/crud-manager";

export default function AdminSkillsPage() {
  return (
    <CrudManager
      title="Skills"
      endpoint="/api/skills"
      fields={[
        { name: "name", label: "Name" },
        { name: "category", label: "Category" },
        { name: "level", label: "Level (1-100)", type: "number" },
        { name: "icon", label: "Icon" }
      ]}
    />
  );
}
