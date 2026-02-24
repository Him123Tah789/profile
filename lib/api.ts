import { NextResponse } from "next/server";
import { ZodSchema } from "zod";

export async function parseJson<T>(req: Request, schema: ZodSchema<T>) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      error: NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    };
  }

  return { data: parsed.data };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function serverError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.error(error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
