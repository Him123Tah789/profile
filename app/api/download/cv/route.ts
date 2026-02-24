import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const cv = await db.cV.findFirst({ where: { isActive: true }, orderBy: { createdAt: "desc" } });

  if (!cv) return NextResponse.json({ error: "CV not found" }, { status: 404 });

  await db.analyticsEvent.create({ data: { type: "DOWNLOAD", path: "/cv", metadata: { cvId: cv.id } } });
  return NextResponse.redirect(new URL(cv.fileUrl, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
