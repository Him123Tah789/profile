import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="mx-auto flex max-w-7xl gap-0 px-4 py-8">
      <AdminSidebar />
      <section className="flex-1 p-4">
        <div className="mb-6 flex justify-end">
          <SignOutButton />
        </div>
        {children}
      </section>
    </div>
  );
}
