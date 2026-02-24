import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";

export default async function ResearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; year?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();
  const year = Number(params.year || 0);

  const papers = await db.paper.findMany({
    where: {
      status: "PUBLISHED",
      ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { abstract: { contains: q, mode: "insensitive" } }] } : {}),
      ...(year ? { year } : {})
    },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageTracker path="/research" />
      <h1 className="mb-6 text-3xl font-bold">Research</h1>
      <div className="grid gap-4">
        {papers.map((paper) => (
          <Card key={paper.id}>
            <CardTitle>{paper.title}</CardTitle>
            <CardDescription className="mt-2">{paper.venue} ({paper.year})</CardDescription>
            <p className="mt-2 text-sm text-muted-foreground">{paper.abstract}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
