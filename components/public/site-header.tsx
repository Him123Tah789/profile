import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/certificates", label: "Certificates" },
  { href: "/skills", label: "Skills" },
  { href: "/activity", label: "Activity" },
  { href: "/documents", label: "Documents" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const profile = await db.profile.findFirst();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight gradient-text hover:opacity-80 transition-opacity">
          {profile?.name || "Portfolio"}
        </Link>
        <nav className="hidden gap-1 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-muted-foreground font-medium hover:text-foreground hover:bg-primary/5 transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/api/download/cv">
          <Button className="rounded-full shadow-md hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300">
            Download CV
          </Button>
        </Link>
      </div>
    </header>
  );
}
