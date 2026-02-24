import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { cvSchema } from "@/lib/validations";

export async function GET() {
  const items = await db.cV.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const parsed = await parseJson(req, cvSchema);
    if ("error" in parsed) return parsed.error;

    if (parsed.data.isActive) {
      await db.cV.updateMany({ data: { isActive: false } });
    }

    const item = await db.cV.create({ data: parsed.data });
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}
