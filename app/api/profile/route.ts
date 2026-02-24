import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseJson, serverError } from "@/lib/api";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const profile = await db.profile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const parsed = await parseJson(req, profileSchema);
    if ("error" in parsed) return parsed.error;

    const existing = await db.profile.findFirst();
    const profile = existing
      ? await db.profile.update({ where: { id: existing.id }, data: parsed.data })
      : await db.profile.create({ data: parsed.data });

    return NextResponse.json(profile);
  } catch (error) {
    return serverError(error);
  }
}
