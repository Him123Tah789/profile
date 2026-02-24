import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fef3c7, #d1fae5)",
          padding: 70
        }}
      >
        <h1 style={{ fontSize: 56, margin: 0 }}>{post?.title || "Activity"}</h1>
        <p style={{ fontSize: 28 }}>Portfolio activity update</p>
      </div>
    ),
    size
  );
}
