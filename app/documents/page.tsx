import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

export default async function DocumentsPage() {
  const docs = await db.document.findMany({
    where: { visibility: "PUBLIC", status: "PUBLISHED" },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <PageTracker path="/documents" />

      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">Documents</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">Downloadable resources and files.</p>
      </FadeIn>

      <StaggerContainer className="mt-12 grid gap-6">
        {docs.map((doc) => (
          <StaggerItem key={doc.id}>
            <Card className="flex items-center justify-between">
              <div className="flex-grow">
                <CardTitle className="text-xl">{doc.title}</CardTitle>
                <CardDescription className="mt-2">{doc.description || doc.category}</CardDescription>
              </div>
              <Link
                className="ml-6 shrink-0 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-all duration-300"
                href={`/api/download/document/${doc.id}`}
              >
                ↓ Download
              </Link>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
