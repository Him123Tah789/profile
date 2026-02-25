import { db } from "@/lib/db";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

export default async function SkillsPage() {
  const skills = await db.skill.findMany({ orderBy: [{ category: "asc" }, { level: "desc" }] });

  // Group skills by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <PageTracker path="/skills" />

      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">Skills</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">Technologies and tools I work with.</p>
      </FadeIn>

      <div className="mt-12 space-y-12">
        {Object.entries(grouped).map(([category, categorySkills], catIdx) => (
          <div key={category}>
            <FadeIn delay={catIdx * 0.1}>
              <h2 className="text-2xl font-bold tracking-tight mb-6">{category}</h2>
            </FadeIn>
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categorySkills.map((skill) => (
                <StaggerItem key={skill.id}>
                  <div className="group rounded-2xl border bg-card/80 backdrop-blur-sm p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold group-hover:text-primary transition-colors duration-300">{skill.name}</p>
                      <span className="text-sm font-medium text-muted-foreground">{skill.level}%</span>
                    </div>
                    {/* Animated progress bar */}
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
