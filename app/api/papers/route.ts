import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession, requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { parseListQuery } from "@/lib/query";
import { makeSlug } from "@/lib/slug";
import { paperSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getAuthSession();
  const { q, skip, limit } = parseListQuery(req.url);

  const where = {
    ...(session?.user?.role === "ADMIN" ? {} : { status: "PUBLISHED" as const }),
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { tags: { hasSome: [q] } }] } : {})
  };

  const [items, total] = await Promise.all([
    db.paper.findMany({ where, skip, take: limit, orderBy: [{ year: "desc" }, { createdAt: "desc" }] }),
    db.paper.count({ where })
  ]);

  return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const parsed = await parseJson(req, paperSchema);
    if ("error" in parsed) return parsed.error;

    const item = await db.paper.create({ data: { ...parsed.data, slug: makeSlug(parsed.data.title) } });
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}
