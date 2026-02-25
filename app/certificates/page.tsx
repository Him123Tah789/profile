import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTracker } from "@/components/public/page-tracker";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

export default async function CertificatesPage() {
  const certificates = await db.certificate.findMany({ orderBy: { year: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <PageTracker path="/certificates" />

      <FadeIn>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-2">
          <span className="gradient-text">Certificates</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">Professional certifications and achievements.</p>
      </FadeIn>

      <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2">
        {certificates.map((item) => (
          <StaggerItem key={item.id} className="h-full">
            <Card className="h-full flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <Badge className="bg-accent/10 text-accent border-0 shrink-0">{item.year}</Badge>
              </div>
              <CardDescription className="mt-3">{item.issuer}</CardDescription>
              {item.credentialUrl && (
                <Link
                  href={item.credentialUrl}
                  target="_blank"
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4 transition-all"
                >
                  View Credential →
                </Link>
              )}
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
