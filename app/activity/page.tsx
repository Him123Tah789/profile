import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";

export default async function ActivityPage() {
  const posts = await db.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageTracker path="/activity" />
      <h1 className="mb-6 text-3xl font-bold">Activity</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className="mt-2">{post.excerpt || "Article"}</CardDescription>
            <Link className="mt-3 inline-block text-primary" href={`/activity/${post.slug}`}>Read</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
