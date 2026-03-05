import { redirect } from "next/navigation";

interface RFPIndexPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RFPIndexPage({ params }: RFPIndexPageProps) {
  const { locale } = await params;
  // La home apunta a /rfp sin brand — redirigir a opav por defecto
  redirect(`/${locale}/rfp/opav`);
}
