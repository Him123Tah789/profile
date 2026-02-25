import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

export default async function ActivityPage() {
  const posts = await db.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <PageTracker path="/activity" />

      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">Activity</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">Thoughts, articles, and latest updates.</p>
      </FadeIn>

      <StaggerContainer className="mt-12 grid gap-6">
        {posts.map((post) => (
          <StaggerItem key={post.id}>
            <Card className="flex items-center justify-between">
              <div className="flex-grow">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="mt-2">{post.excerpt || "Read the full article."}</CardDescription>
              </div>
              <Link
                className="ml-6 shrink-0 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                href={`/activity/${post.slug}`}
              >
                Read <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
