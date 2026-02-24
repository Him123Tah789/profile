import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession, requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { parseListQuery } from "@/lib/query";
import { documentSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getAuthSession();
  const { q, skip, limit } = parseListQuery(req.url);

  const where = {
    ...(session?.user?.role === "ADMIN" ? {} : { visibility: "PUBLIC" as const, status: "PUBLISHED" as const }),
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { category: { contains: q, mode: "insensitive" as const } }] } : {})
  };

  const [items, total] = await Promise.all([
    db.document.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    db.document.count({ where })
  ]);

  return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const parsed = await parseJson(req, documentSchema);
    if ("error" in parsed) return parsed.error;

    const item = await db.document.create({ data: parsed.data });
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}
