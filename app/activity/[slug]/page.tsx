import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn } from "@/components/ui/animations";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post) return { title: "Activity" };

  return {
    title: post.title,
    description: post.excerpt || "Activity post",
    openGraph: {
      images: [`/activity/${slug}/opengraph-image`]
    }
  };
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });

  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <PageTracker path={`/activity/${slug}`} />

      <FadeIn>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">
          <span className="gradient-text">{post.title}</span>
        </h1>
        <p className="mb-8 text-sm text-muted-foreground font-medium">{post.createdAt.toDateString()}</p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline" dangerouslySetInnerHTML={{ __html: post.content }} />
      </FadeIn>
    </article>
  );
}
