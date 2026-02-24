import Link from "next/link";

const items = [
  ["Overview", "/admin"],
  ["Profile", "/admin/profile"],
  ["Projects", "/admin/projects"],
  ["Research", "/admin/research"],
  ["Certificates", "/admin/certificates"],
  ["Skills", "/admin/skills"],
  ["Activity", "/admin/activity"],
  ["Documents", "/admin/documents"],
  ["CV", "/admin/cv"],
  ["Settings", "/admin/settings"]
];

export function AdminSidebar() {
  return (
    <aside className="w-full border-r p-4 md:w-64">
      <p className="mb-4 text-xs uppercase text-muted-foreground">Admin</p>
      <nav className="space-y-1">
        {items.map(([label, href]) => (
          <Link key={href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted" href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
