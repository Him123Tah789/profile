import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession, requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { parseListQuery } from "@/lib/query";
import { postSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getAuthSession();
  const { q, skip, limit } = parseListQuery(req.url);

  const where = {
    ...(session?.user?.role === "ADMIN" ? {} : { status: "PUBLISHED" as const }),
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { tags: { hasSome: [q] } }] } : {})
  };

  const [items, total] = await Promise.all([
    db.post.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    db.post.count({ where })
  ]);

  return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const parsed = await parseJson(req, postSchema);
    if ("error" in parsed) return parsed.error;

    const item = await db.post.create({ data: parsed.data });
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}
