import CompanyHero from "./_components/CompanyHero";
import CompanyMissionVision from "./_components/CompanyMissionVision";
import ManagementAccordion from "./_components/ManagementAccordion";
import BSServiceGrid from "./_components/BSServiceGrid";
import CompanyValues from "./_components/CompanyValues";
import CompanyHistory from "./_components/CompanyHistory";

interface CompanyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen">
      <CompanyHero locale={locale} />

      {/* Mission & Vision */}
      <CompanyMissionVision />
      {/* Values */}
      <CompanyValues />
      {/* History */}
      <CompanyHistory />

      {/* OPAV Management Model */}
      <ManagementAccordion />

      {/* B&S Facilities Services */}
      <BSServiceGrid locale={locale} />
    </main>
  );
}
