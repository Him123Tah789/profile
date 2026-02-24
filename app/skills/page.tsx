import { db } from "@/lib/db";
import { PageTracker } from "@/components/public/page-tracker";

export default async function SkillsPage() {
  const skills = await db.skill.findMany({ orderBy: [{ category: "asc" }, { level: "desc" }] });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageTracker path="/skills" />
      <h1 className="mb-6 text-3xl font-bold">Skills</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {skills.map((skill) => (
          <div key={skill.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{skill.name}</p>
              <p className="text-sm text-muted-foreground">{skill.level}%</p>
            </div>
            <p className="text-xs text-muted-foreground">{skill.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
