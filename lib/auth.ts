import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await getAuthSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
