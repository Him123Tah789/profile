import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { parseJson, serverError } from "@/lib/api";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(`contact:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const parsed = await parseJson(req, contactSchema);
    if ("error" in parsed) return parsed.error;

    await db.analyticsEvent.create({
      data: {
        type: "CONTACT_SUBMIT",
        path: "/contact",
        metadata: parsed.data
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return serverError(error);
  }
}
