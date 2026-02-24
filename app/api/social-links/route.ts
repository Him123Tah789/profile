import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseJson, serverError } from "@/lib/api";
import { socialSchema } from "@/lib/validations";

export async function GET() {
  const data = await db.socialLinks.findFirst();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const parsed = await parseJson(req, socialSchema);
    if ("error" in parsed) return parsed.error;

    const existing = await db.socialLinks.findFirst();
    const data = existing
      ? await db.socialLinks.update({ where: { id: existing.id }, data: parsed.data })
      : await db.socialLinks.create({ data: parsed.data });

    return NextResponse.json(data);
  } catch (error) {
    return serverError(error);
  }
}
