/**
 * SEO Utilities
 * Structured data, metadata helpers, and SEO optimization functions
 */

import { BlogPost } from "@/types/blog";
import type { Metadata } from "next";

/**
 * Generate comprehensive JSON-LD structured data for blog posts
 */
export function generateBlogPostJsonLd(
  post: BlogPost,
  locale: string,
  slug: string,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opav.com.co";
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  // Priorizar openGraphImage, sino imagenPrincipal
  const ogImage = post.openGraphImage || post.imagenPrincipal;
  const imageUrl = ogImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${ogImage.url}`
    : `${siteUrl}/images/og-vacantes.jpg`; // Fallback image

  // Type narrowing para acceder a propiedades opcionales
  const imageAlt =
    "alternativeText" in (ogImage || {})
      ? (ogImage as typeof post.imagenPrincipal).alternativeText || post.titulo
      : post.titulo;
  const imageCaption =
    "caption" in (ogImage || {})
      ? (ogImage as typeof post.imagenPrincipal).caption
      : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Article
      {
        "@type": "Article",
        "@id": `${postUrl}#article`,
        headline: post.seoTitle || post.titulo,
        description: post.metaDescription || post.resumen,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          width: ogImage?.width || 1200,
          height: ogImage?.height || 630,
          caption: imageCaption,
          alt: imageAlt,
        },
        datePublished: post.fechaPublicacion,
        dateModified: post.updatedAt || post.fechaPublicacion,
        author: post.author
          ? {
              "@type": "Person",
              "@id": `${siteUrl}/#person-${post.author.id}`,
              name: post.author.name,
              jobTitle: post.author.role,
              description: post.author.bio,
              image: post.author.avatar?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${post.author.avatar.url}`
                : undefined,
              sameAs: [
                post.author.social_linkedin,
                post.author.social_x,
              ].filter(Boolean),
            }
          : {
              "@type": "Organization",
              name: "OPAV Editorial Team",
            },
        publisher: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "OPAV SAS",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo-opav.svg`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
        keywords: post.tags?.join(", "),
        articleSection: post.category?.name,
        inLanguage: locale,
        timeRequired: post.tiempoLectura
          ? `PT${post.tiempoLectura}M`
          : undefined,
      },
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "es" ? "Inicio" : "Home",
            item: `${siteUrl}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${siteUrl}/${locale}/blog`,
          },
          ...(post.category
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.category.name,
                  item: `${siteUrl}/${locale}/blog/category/${post.category.slug}`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: post.category ? 4 : 3,
            name: post.titulo,
            item: postUrl,
          },
        ],
      },
      // WebPage
      {
        "@type": "WebPage",
        "@id": postUrl,
        url: postUrl,
        name: post.seoTitle || post.titulo,
        description: post.metaDescription || post.resumen,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          name: "OPAV",
          url: siteUrl,
        },
        breadcrumb: {
          "@id": `${postUrl}#breadcrumb`,
        },
        inLanguage: locale,
      },
    ],
  };
}

/**
 * Generate optimized metadata for blog posts
 */
export function generateBlogPostMetadata(
  post: BlogPost,
  locale: string,
  slug: string,
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opav.com.co";
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  // Priorizar openGraphImage para redes sociales, sino imagenPrincipal
  const ogImage = post.openGraphImage || post.imagenPrincipal;
  const imageUrl = ogImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${ogImage.url}`
    : `${siteUrl}/images/og-vacantes.jpg`;

  // Type narrowing
  const imageAlt =
    "alternativeText" in (ogImage || {})
      ? (ogImage as typeof post.imagenPrincipal).alternativeText || post.titulo
      : post.titulo;
  const imageMime =
    "mime" in (ogImage || {})
      ? (ogImage as typeof post.openGraphImage & { mime?: string }).mime ||
        "image/jpeg"
      : "image/jpeg";

  return {
    title: `${post.seoTitle || post.titulo} | OPAV Editorial`,
    description: (
      post.metaDescription ||
      post.resumen ||
      post.titulo
    ).substring(0, 160), // SEO best practice: max 160 chars
    keywords: post.tags?.join(", ") || "",
    authors: post.author ? [{ name: post.author.name }] : [],
    creator: post.author?.name || "OPAV Editorial Team",
    publisher: "OPAV SAS",
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.seoTitle || post.titulo,
      description: post.metaDescription || post.resumen || post.titulo,
      siteName: "OPAV",
      locale: locale === "es" ? "es_CO" : "en_US",
      images: [
        {
          url: imageUrl,
          width: ogImage?.width || 1200,
          height: ogImage?.height || 630,
          alt: imageAlt,
          type: imageMime,
        },
      ],
      publishedTime: post.fechaPublicacion,
      modifiedTime: post.updatedAt || post.fechaPublicacion,
      authors: post.author ? [post.author.name] : [],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@opav_co",
      creator: post.author?.social_x
        ? `@${post.author.social_x.split("/").pop()}`
        : "@opav_co",
      title: post.seoTitle || post.titulo,
      description: post.metaDescription || post.resumen || post.titulo,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
      languages: {
        es: `${siteUrl}/es/blog/${slug}`,
        en: `${siteUrl}/en/blog/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: post.category?.name,
  };
}

/**
 * Calculate estimated reading time from content
 */
export function calculateReadingTime(content: any): number {
  if (!content) return 0;

  let wordCount = 0;

  // If content is a string
  if (typeof content === "string") {
    wordCount = content.split(/\s+/).length;
  }
  // If content is Strapi rich text array
  else if (Array.isArray(content)) {
    const text = extractTextFromRichContent(content);
    wordCount = text.split(/\s+/).length;
  }

  // Average reading speed: 200-250 words per minute
  const wordsPerMinute = 225;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes || 1; // Minimum 1 minute
}

/**
 * Extract plain text from Strapi rich content
 */
function extractTextFromRichContent(content: any[]): string {
  let text = "";

  content.forEach((node) => {
    if (node.type === "text") {
      text += node.text + " ";
    } else if (node.children) {
      text += extractTextFromRichContent(node.children);
    }
  });

  return text;
}

/**
 * Generate FAQ schema if insights/key points exist
 */
export function generateFAQSchema(insights: string[], locale: string) {
  if (!insights || insights.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: insights.map((insight, index) => ({
      "@type": "Question",
      name:
        locale === "es"
          ? `Punto clave ${index + 1}`
          : `Key insight ${index + 1}`,
      acceptedAnswer: {
        "@type": "Answer",
        text: insight,
      },
    })),
  };
}
