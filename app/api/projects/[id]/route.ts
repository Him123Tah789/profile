import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { projectSchema } from "@/lib/validations";
import { makeSlug } from "@/lib/slug";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const parsed = await parseJson(req, projectSchema);
    if ("error" in parsed) return parsed.error;

    const item = await db.project.update({
      where: { id },
      data: { ...parsed.data, slug: makeSlug(parsed.data.title) }
    });

    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
