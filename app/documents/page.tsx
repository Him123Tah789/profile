import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";

export default async function DocumentsPage() {
  const docs = await db.document.findMany({
    where: { visibility: "PUBLIC", status: "PUBLISHED" },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageTracker path="/documents" />
      <h1 className="mb-6 text-3xl font-bold">Documents</h1>
      <div className="grid gap-4">
        {docs.map((doc) => (
          <Card key={doc.id}>
            <CardTitle>{doc.title}</CardTitle>
            <CardDescription className="mt-2">{doc.description || doc.category}</CardDescription>
            <Link className="mt-3 inline-block text-sm text-primary" href={`/api/download/document/${doc.id}`}>
              Download
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
