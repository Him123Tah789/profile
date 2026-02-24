import { db } from "@/lib/db";
import { PageTracker } from "@/components/public/page-tracker";

export default async function AboutPage() {
  const profile = await db.profile.findFirst();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageTracker path="/about" />
      <h1 className="mb-4 text-3xl font-bold">About</h1>
      <p className="text-muted-foreground">{profile?.bio || "Update your profile bio from admin panel."}</p>
    </div>
  );
}
