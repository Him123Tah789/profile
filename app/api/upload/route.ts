import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { storeFile } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      return NextResponse.json({ error: "Valid file is required" }, { status: 400 });
    }

    const validFile = file as any;

    const url = await storeFile(validFile);
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("DEBUG UPLOAD ERROR:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
