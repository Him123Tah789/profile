import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";
import { getCachedGitHub } from "@/lib/github";

export default async function HomePage() {
  const [profile, featuredProjects, latestPosts, cv, github] = await Promise.all([
    db.profile.findFirst(),
    db.project.findMany({ where: { featured: true, status: "PUBLISHED" }, take: 3, orderBy: { createdAt: "desc" } }),
    db.post.findMany({ where: { status: "PUBLISHED" }, take: 3, orderBy: { createdAt: "desc" } }),
    db.cV.findFirst({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    getCachedGitHub()
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
      <PageTracker path="/" />
      <section className="rounded-2xl bg-gradient-to-br from-orange-100 via-amber-50 to-emerald-100 p-8 md:p-12">
        <Badge className="mb-3">Open to collaboration</Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{profile?.name || "Developer/Researcher"}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{profile?.headline || "Full-stack engineering and practical AI research for production systems."}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/projects"><Button>View Projects</Button></Link>
          <Link href={cv ? "/api/download/cv" : "/documents"}><Button variant="outline">Download CV</Button></Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Featured Projects</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <Card key={project.id}>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="mt-2">{project.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Latest Activity</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {latestPosts.map((post) => (
            <Card key={post.id}>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription className="mt-2">{post.excerpt || "Read the full article."}</CardDescription>
              <Link className="mt-3 inline-block text-sm text-primary" href={`/activity/${post.slug}`}>Read more</Link>
            </Card>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">GitHub</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardTitle>Recent Repositories</CardTitle>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {github.repos?.slice(0, 5).map((repo: any) => (
                <li key={repo.id}>{repo.name}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardTitle>Latest Commits</CardTitle>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {github.commits?.slice(0, 5).map((commit: any, i: number) => (
                <li key={i}>{commit.message}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
