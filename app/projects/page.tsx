import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <PageTracker path="/projects" />

      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">Projects</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">Things I&apos;ve built and contributed to.</p>
      </FadeIn>

      <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <StaggerItem key={project.id} className="h-full">
            <Card className="h-full flex flex-col">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription className="mt-3 flex-grow">{project.description}</CardDescription>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} className="bg-primary/10 text-primary border-0 hover:bg-primary/20 transition-colors">{tag}</Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                {project.githubLink && (
                  <Link href={project.githubLink} target="_blank" className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-all">
                    GitHub →
                  </Link>
                )}
                {project.liveLink && (
                  <Link href={project.liveLink} target="_blank" className="text-sm font-medium text-accent hover:underline underline-offset-4 transition-all">
                    Live Demo →
                  </Link>
                )}
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
