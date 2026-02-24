import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.analyticsEvent.create({
      data: {
        type: body.type || "PAGE_VIEW",
        path: body.path || null,
        metadata: body.metadata || null
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
