import { db } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PageTracker } from "@/components/public/page-tracker";

export default async function CertificatesPage() {
  const certificates = await db.certificate.findMany({ orderBy: { year: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageTracker path="/certificates" />
      <h1 className="mb-6 text-3xl font-bold">Certificates</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((item) => (
          <Card key={item.id}>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription className="mt-2">{item.issuer} - {item.year}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
