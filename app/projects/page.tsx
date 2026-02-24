import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageTracker path="/projects" />
      <h1 className="mb-6 text-3xl font-bold">Projects</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription className="mt-2">{project.description}</CardDescription>
            <div className="mt-3 flex flex-wrap gap-2">{project.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
