import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const profile = await db.profile.findFirst();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          {profile?.name || "Portfolio"}
        </Link>
        <nav className="hidden gap-5 text-sm md:flex">
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/research">Research</Link>
          <Link href="/certificates">Certificates</Link>
          <Link href="/skills">Skills</Link>
          <Link href="/activity">Activity</Link>
          <Link href="/documents">Documents</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <Link href="/api/download/cv">
          <Button>Download CV</Button>
        </Link>
      </div>
    </header>
  );
}
