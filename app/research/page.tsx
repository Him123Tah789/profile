import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

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
    <div className="mx-auto max-w-6xl px-4 py-16">
      <PageTracker path="/research" />

      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">Research</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">Published papers, studies, and academic work.</p>
      </FadeIn>

      <StaggerContainer className="mt-12 grid gap-6">
        {papers.map((paper) => (
          <StaggerItem key={paper.id}>
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <CardTitle className="text-xl">{paper.title}</CardTitle>
                  <CardDescription className="mt-2 font-medium">
                    {paper.venue} <span className="text-primary">({paper.year})</span>
                  </CardDescription>
                </div>
                {paper.citations > 0 && (
                  <Badge className="bg-primary/10 text-primary border-0 shrink-0">{paper.citations} citations</Badge>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">{paper.abstract}</p>
              <div className="mt-4 flex gap-3">
                {paper.pdfLink && (
                  <a href={paper.pdfLink} target="_blank" className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-all">PDF →</a>
                )}
                {paper.codeLink && (
                  <a href={paper.codeLink} target="_blank" className="text-sm font-medium text-accent hover:underline underline-offset-4 transition-all">Code →</a>
                )}
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
