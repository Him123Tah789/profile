import { db } from "@/lib/db";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default async function AboutPage() {
  const profile = await db.profile.findFirst();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <PageTracker path="/about" />

      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">About Me</span>
        </h1>
      </FadeIn>

      <SlideIn delay={0.15} direction="up">
        <div className="mt-8 rounded-2xl border bg-card/80 backdrop-blur-sm p-8 shadow-sm">
          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {profile?.bio || "Update your profile bio from admin panel."}
          </p>
        </div>
      </SlideIn>

      {profile?.location && (
        <SlideIn delay={0.25} direction="up">
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Based in {profile.location}</span>
          </div>
        </SlideIn>
      )}
    </div>
  );
}
