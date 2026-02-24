import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { serverError } from "@/lib/api";
import { reindexKnowledge } from "@/lib/ai/indexer";

export async function POST() {
  try {
    await requireAdmin();
    const result = await reindexKnowledge();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return serverError(error);
  }
}
