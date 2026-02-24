import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { makeSlug } from "@/lib/slug";
import { paperSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const parsed = await parseJson(req, paperSchema);
    if ("error" in parsed) return parsed.error;

    const item = await db.paper.update({ where: { id }, data: { ...parsed.data, slug: makeSlug(parsed.data.title) } });
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.paper.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
