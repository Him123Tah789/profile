import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { postSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const parsed = await parseJson(req, postSchema);
    if ("error" in parsed) return parsed.error;

    const item = await db.post.update({ where: { id }, data: parsed.data });
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
