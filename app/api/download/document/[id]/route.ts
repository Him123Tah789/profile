import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await db.document.findUnique({ where: { id } });

  if (!doc || doc.visibility !== "PUBLIC" || doc.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  await db.analyticsEvent.create({ data: { type: "DOWNLOAD", path: `/documents/${id}`, metadata: { documentId: id } } });
  return NextResponse.redirect(new URL(doc.fileUrl, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
