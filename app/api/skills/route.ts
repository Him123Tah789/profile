import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession, requireAdmin } from "@/lib/auth";
import { parseJson, serverError } from "@/lib/api";
import { parseListQuery } from "@/lib/query";
import { skillSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await getAuthSession();
  const { q, skip, limit } = parseListQuery(req.url);

  const where = q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { category: { contains: q, mode: "insensitive" as const } }] } : {};
  if (!session?.user || session.user.role !== "ADMIN") {
    // skills are public
  }

  const [items, total] = await Promise.all([
    db.skill.findMany({ where, skip, take: limit, orderBy: [{ category: "asc" }, { level: "desc" }] }),
    db.skill.count({ where })
  ]);

  return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const parsed = await parseJson(req, skillSchema);
    if ("error" in parsed) return parsed.error;
    const item = await db.skill.create({ data: parsed.data });
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}
