import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { storeFile } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const url = await storeFile(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
