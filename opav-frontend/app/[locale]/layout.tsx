import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales } from "@/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipToContent from "@/components/ui/SkipToContent";
import { WebVitals } from "@/components/WebVitals";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import RecaptchaScript from "@/components/RecaptchaScript";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://opav.com.co",
  ),
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={fontVariables} data-scroll-behavior="smooth">
      <head>
        {/* PWA and Favicon */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logos/opav-logo.png" />
        <meta name="theme-color" content="#d50058" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OPAV" />
        <meta name="format-detection" content="telephone=no" />

        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}
        />
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased overflow-x-hidden">
        <GoogleAnalytics />
        <RecaptchaScript />
        <NextIntlClientProvider messages={messages}>
          <WebVitals />
          <SkipToContent />
          <Header locale={locale} />
          <main id="main-content" className="flex-grow" tabIndex={-1}>
            {children}
          </main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
