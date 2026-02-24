import { db } from "@/lib/db";

export default async function AdminOverviewPage() {
  const [projects, papers, posts, docs, pageViews, downloads] = await Promise.all([
    db.project.count(),
    db.paper.count(),
    db.post.count(),
    db.document.count(),
    db.analyticsEvent.count({ where: { type: "PAGE_VIEW" } }),
    db.analyticsEvent.count({ where: { type: "DOWNLOAD" } })
  ]);

  const cards = [
    ["Projects", projects],
    ["Papers", papers],
    ["Posts", posts],
    ["Documents", docs],
    ["Page views", pageViews],
    ["Downloads", downloads]
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-semibold">{String(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
