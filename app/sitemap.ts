import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const posts = await db.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } });

  const staticRoutes = ["", "/about", "/skills", "/projects", "/research", "/certificates", "/documents", "/activity", "/contact"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...posts.map((post) => ({
      url: `${base}/activity/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
