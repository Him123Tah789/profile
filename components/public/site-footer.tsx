export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-transparent to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Crafted with <span className="gradient-text font-semibold">Next.js</span>, Prisma, PostgreSQL & Tailwind CSS.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} All rights reserved.
        </p>
        <p className="mt-3 text-xs text-muted-foreground/40">
          Designed & Developed by <span className="font-semibold gradient-text">FAISHAL UDDIN HIMEL</span>
        </p>
      </div>
    </footer>
  );
}
