import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export const locales = routing.locales;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Obtener el locale de la request
  const locale = await requestLocale;

  // Validar que es un locale soportado
  if (!locale || !routing.locales.includes(locale as Locale)) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
