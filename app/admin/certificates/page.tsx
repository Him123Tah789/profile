"use client";

import { CrudManager } from "@/components/admin/crud-manager";

export default function AdminCertificatesPage() {
  return (
    <CrudManager
      title="Certificates"
      endpoint="/api/certificates"
      fields={[
        { name: "title", label: "Title" },
        { name: "issuer", label: "Issuer" },
        { name: "year", label: "Year", type: "number" },
        { name: "credentialUrl", label: "Credential URL" },
        { name: "assetUrl", label: "Asset URL", type: "file" },
        { name: "tags", label: "Tags (comma-separated)" }
      ]}
    />
  );
}
