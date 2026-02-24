import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageTracker } from "@/components/public/page-tracker";

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
    <article className="mx-auto max-w-3xl px-4 py-10">
      <PageTracker path={`/activity/${slug}`} />
      <h1 className="mb-2 text-4xl font-bold">{post.title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{post.createdAt.toDateString()}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
