interface JobPostingSchemaProps {
  job: any;
  locale: string;
}

export default function JobPostingSchema({
  job,
  locale,
}: JobPostingSchemaProps) {
  // Mapear tipo de contrato a formato Schema.org
  const employmentTypeMap: Record<string, string> = {
    indefinido: "FULL_TIME",
    temporal: "TEMPORARY",
    porObra: "CONTRACTOR",
  };

  // Extraer valores numéricos del salario si es posible (ej: "$3,000,000" -> 3000000)
  const extractSalaryValue = (salarioStr: string): number | undefined => {
    if (!salarioStr) return undefined;
    const match = salarioStr.match(/[\d,]+/);
    if (match) {
      const numericValue = match[0].replace(/,/g, "");
      return parseInt(numericValue, 10);
    }
    return undefined;
  };

  // Construir el objeto de salario si existe - mejorado para Google Jobs
  const baseSalary = job.salario
    ? {
        "@type": "MonetaryAmount",
        currency: "COP",
        value: {
          "@type": "QuantitativeValue",
          value: extractSalaryValue(job.salario) || job.salario,
          unitText: "MONTH",
        },
      }
    : undefined;

  // Convertir experiencia a meses si es texto (ej: "2 años" -> 24)
  const extractMonthsOfExperience = (expStr: string): number | undefined => {
    if (!expStr) return undefined;
    if (typeof expStr === "number") return expStr;

    const yearsMatch = expStr.match(/(\d+)\s*a[ñn]os?/i);
    if (yearsMatch) return parseInt(yearsMatch[1], 10) * 12;

    const monthsMatch = expStr.match(/(\d+)\s*mes(es)?/i);
    if (monthsMatch) return parseInt(monthsMatch[1], 10);

    return undefined;
  };

  // Determinar la organización (OPAV o B&S)
  const isOPAV = job.empresa?.toLowerCase().includes("opav");
  const organizationName = isOPAV ? "OPAV" : "B&S Facilities";
  const organizationUrl = "https://opav.com.co";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || organizationUrl;

  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.titulo,
    description: job.descripcion || "",
    identifier: {
      "@type": "PropertyValue",
      name: organizationName,
      value: job.documentId || job.id,
    },
    datePosted: job.publishedAt || job.createdAt,
    validThrough: job.fechaCierre || undefined,
    employmentType: employmentTypeMap[job.tipoContrato] || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: organizationName,
      sameAs: organizationUrl,
      logo: `${organizationUrl}/icons/icon-512x512.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.ciudad || "Bogotá",
        addressRegion: job.ciudad || "Bogotá",
        addressCountry: "CO",
      },
    },
    // Campos obligatorios de Google Jobs
    applicantLocationRequirements: {
      "@type": "Country",
      name: "CO",
    },
    jobLocationType: "TELECOMMUTE", // Cambiar según necesidad desde CMS
    directApply: true,
    baseSalary: baseSalary,
    qualifications: job.nivelEducativo || undefined,
    experienceRequirements: extractMonthsOfExperience(job.experienciaRequerida)
      ? {
          "@type": "OccupationalExperienceRequirements",
          monthsOfExperience: extractMonthsOfExperience(
            job.experienciaRequerida
          ),
        }
      : job.experienciaRequerida
      ? {
          "@type": "OccupationalExperienceRequirements",
          description: job.experienciaRequerida,
        }
      : undefined,
    responsibilities: job.requisitos || undefined,
    industry: job.area || "Administración de Propiedades",
    occupationalCategory: job.area || undefined,
  };

  // Remover campos undefined
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}
