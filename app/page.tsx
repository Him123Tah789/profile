import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";
import { getCachedGitHub } from "@/lib/github";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animations";
import { User } from "lucide-react";

export default async function HomePage() {
  const [profile, featuredProjects, latestPosts, cv, github] = await Promise.all([
    db.profile.findFirst(),
    db.project.findMany({ where: { featured: true, status: "PUBLISHED" }, take: 3, orderBy: { createdAt: "desc" } }),
    db.post.findMany({ where: { status: "PUBLISHED" }, take: 3, orderBy: { createdAt: "desc" } }),
    db.cV.findFirst({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    getCachedGitHub()
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-16">
      <PageTracker path="/" />

      <FadeIn>
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 p-8 md:p-16 dark:from-indigo-950/30 dark:via-background dark:to-purple-900/20 shadow-sm border border-black/5 dark:border-white/5">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column: Text Content */}
            <div className="space-y-8 z-10 relative">
              <div>
                <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors border-0 text-sm py-1.5 px-4 animate-pulse-slow">
                  Available for Opportunities
                </Badge>
                <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 pb-2">
                  {profile?.name || "Developer / Researcher"}
                </h1>
              </div>

              <p className="max-w-xl text-xl text-muted-foreground leading-relaxed">
                {profile?.headline || "Building elegant, high-performance web applications and researching AI."}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/projects">
                  <Button size="lg" className="rounded-full font-medium shadow-lg hover:shadow-primary/25 hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                    View Projects
                  </Button>
                </Link>
                <Link href={cv ? "/api/download/cv" : "/documents"}>
                  <Button size="lg" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/5 hover:text-foreground font-medium transition-all duration-300 hover:-translate-y-1">
                    Download CV
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Profile Image */}
            <div className="hidden lg:flex justify-center items-center relative z-10">
              <ScaleIn delay={0.2}>
                <div className="relative animate-float">
                  {/* Decorative background blobs behind the image */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-purple-400/30 blur-2xl rounded-full opacity-60"></div>

                  {/* The Profile Image Container */}
                  <div className="w-[340px] h-[340px] rounded-full border-8 border-background/60 backdrop-blur-sm shadow-2xl overflow-hidden bg-muted flex flex-col justify-center items-center relative z-20 transition-transform duration-500 hover:scale-[1.02]">
                    {profile?.photoUrl ? (
                      <img src={profile.photoUrl} alt={profile.name || "Profile"} className="object-cover w-full h-full" />
                    ) : (
                      <>
                        <User className="w-32 h-32 text-muted-foreground/40 mb-4" />
                        <span className="text-sm text-muted-foreground/60 font-medium z-10">Add profile image in admin</span>
                      </>
                    )}
                  </div>
                </div>
              </ScaleIn>
            </div>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl rounded-full pointer-events-none"></div>
        </section>
      </FadeIn>

      <section className="space-y-8">
        <FadeIn>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
            <Link href="/projects" className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-all">View all &rarr;</Link>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <Card className="group h-full overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-primary/10">
                <div className="p-6 h-full flex flex-col relative z-10">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{project.title}</CardTitle>
                  <CardDescription className="mt-3 leading-relaxed flex-grow">{project.description}</CardDescription>
                </div>
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 rounded-2xl -z-0"></div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="space-y-8">
        <FadeIn>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Latest Activity</h2>
            <Link href="/activity" className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-all">Read blog &rarr;</Link>
          </div>
        </FadeIn>
        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {latestPosts.map((post) => (
            <StaggerItem key={post.id} className="h-full">
              <Card className="group h-full flex flex-col justify-between overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-primary/10">
                <div className="p-6 flex-grow relative z-10">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 font-semibold tracking-tight">{post.title}</CardTitle>
                  <CardDescription className="mt-3 leading-relaxed">{post.excerpt || "Read the full article."}</CardDescription>
                </div>
                <div className="px-6 pb-6 mt-auto relative z-10">
                  <Link className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors" href={`/activity/${post.slug}`}>
                    Read more <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                  </Link>
                </div>
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all duration-500 rounded-2xl -z-0"></div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="space-y-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight">GitHub Activity</h2>
        </FadeIn>
        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          <StaggerItem>
            <Card className="h-full rounded-2xl border shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl bg-card/50 backdrop-blur-sm">
              <div className="p-6">
                <CardTitle className="text-lg">Recent Repositories</CardTitle>
                <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                  {github.repos?.slice(0, 5).map((repo: any) => (
                    <li key={repo.id} className="flex items-center gap-3 group/repo">
                      <div className="h-2 w-2 rounded-full bg-primary/60 group-hover/repo:scale-150 transition-transform duration-300" />
                      <span className="font-medium text-foreground group-hover/repo:text-primary transition-colors duration-300">{repo.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="h-full rounded-2xl border shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl bg-card/50 backdrop-blur-sm">
              <div className="p-6">
                <CardTitle className="text-lg">Latest Commits</CardTitle>
                <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                  {github.commits?.slice(0, 5).map((commit: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 truncate group/commit">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40 group-hover/commit:bg-primary transition-colors duration-300" />
                      <span className="truncate group-hover/commit:text-foreground transition-colors duration-300">{commit.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </section>
    </div>
  );
}
