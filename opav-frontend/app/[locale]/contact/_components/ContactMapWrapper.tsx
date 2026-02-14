"use client";

import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/components/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

interface ContactMapWrapperProps {
  locale: string;
}

export default function ContactMapWrapper({ locale }: ContactMapWrapperProps) {
  return <ContactMap locale={locale} />;
}
