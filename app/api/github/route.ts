import { NextResponse } from "next/server";
import { getCachedGitHub } from "@/lib/github";

export async function GET() {
  const data = await getCachedGitHub();
  return NextResponse.json(data);
}
