import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",

  pathnames: {
    "/": "/",
    "/cobertura": {
      es: "/cobertura",
      en: "/coverage",
    },
    "/proveedores": {
      es: "/proveedores",
      en: "/providers",
    },
    "/company": {
      es: "/compania",
      en: "/company",
    },
    "/services": {
      es: "/servicios",
      en: "/services",
    },
    "/contact": {
      es: "/contacto",
      en: "/contact",
    },
    "/blog": {
      es: "/blog",
      en: "/blog",
    },
    "/casos-exito": {
      es: "/casos-exito",
      en: "/success-cases",
    },
    "/certificaciones": {
      es: "/certificaciones",
      en: "/certifications",
    },
    "/vacantes": {
      es: "/vacantes",
      en: "/jobs",
    },
  },
});
