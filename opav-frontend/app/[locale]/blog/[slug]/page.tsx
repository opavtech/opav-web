import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BlogPost } from "@/types/blog";
import { transformStrapiPost, transformStrapiPosts } from "@/lib/strapi-blog";
import { fontVariables } from "@/lib/fonts";
import {
  generateBlogPostMetadata,
  generateBlogPostJsonLd,
  generateFAQSchema,
} from "@/lib/seo";
import ReadingProgressBar from "./components/ReadingProgressBar";
import HeroSection from "./components/HeroSection";
import LeadParagraph from "./components/LeadParagraph";
import RichContentRenderer from "./components/RichContentRenderer";
import InsightBox from "./components/InsightBox";
import Separator from "./components/Separator";
import RecommendedArticles from "./components/RecommendedArticles";
import ShareButtons from "./components/ShareButtons";
import BackToTopButton from "./components/BackToTopButton";

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getBlogPost(
  slug: string,
  locale: string
): Promise<BlogPost | null> {
  try {
    // Populate específico para mejor performance - solo traemos lo que necesitamos
    // En Strapi v5, necesitamos usar populate[0]=field1&populate[1]=field2
    const populate = [
      "author",
      "author.avatar",
      "imagenPrincipal",
      "imagenesContenido",
      "category",
      "tags",
      "openGraphImage",
    ]
      .map((field, index) => `populate[${index}]=${field}`)
      .join("&");

    // Configuración de cache: desarrollo vs producción
    const isDev = process.env.NODE_ENV === "development";
    const cacheConfig = isDev
      ? { cache: "no-store" as const } // Desarrollo: sin cache
      : { next: { revalidate: 300, tags: [`blog-post-${slug}`] } }; // Producción: 5 minutos

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&locale=${locale}&${populate}`,
      cacheConfig
    );

    if (!res.ok) {
      console.error("Strapi fetch failed:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      console.error("No blog post found with slug:", slug);
      return null;
    }

    return transformStrapiPost(data.data[0]);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

async function getRecommendedPosts(
  currentSlug: string,
  locale: string
): Promise<BlogPost[]> {
  try {
    // Populate específico - solo necesitamos datos básicos para las cards
    const populate = ["author", "imagenPrincipal", "category", "tags"]
      .map((field, index) => `populate[${index}]=${field}`)
      .join("&");

    const isDev = process.env.NODE_ENV === "development";
    const cacheConfig = isDev
      ? { cache: "no-store" as const }
      : { next: { revalidate: 600, tags: ["blog-posts-recommended"] } }; // 10 minutos

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?filters[slug][$ne]=${currentSlug}&locale=${locale}&${populate}&pagination[limit]=3&sort[0]=fechaPublicacion:desc`,
      cacheConfig
    );

    if (!res.ok) return [];

    const data = await res.json();
    return transformStrapiPosts(data);
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  return generateBlogPostMetadata(post, locale, slug);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) {
    notFound();
  }

  const recommendedPosts = await getRecommendedPosts(slug, locale);

  // Generate optimized JSON-LD structured data
  const jsonLd = generateBlogPostJsonLd(post, locale, slug);

  // Generate FAQ schema if insights exist
  const faqSchema = post.puntosClaves?.length
    ? generateFAQSchema(post.puntosClaves, locale)
    : null;

  return (
    <div className={fontVariables}>
      {/* Skip to main content link para accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        {locale === "es"
          ? "Saltar al contenido principal"
          : "Skip to main content"}
      </a>

      {/* Article JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* FAQ Schema for Insights */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Hero Section */}
      <HeroSection post={post} locale={locale} />

      {/* Main Content Layout */}
      <article
        id="main-content"
        className="relative bg-white"
        role="main"
        aria-labelledby="article-title"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-8">
              {/* Lead Paragraph */}
              {post.parrafoIntroductorio && (
                <LeadParagraph content={post.parrafoIntroductorio} />
              )}

              {/* Rich Content */}
              {post.contenido && (
                <RichContentRenderer content={post.contenido} locale={locale} />
              )}

              {/* Insights Box */}
              {post.puntosClaves && post.puntosClaves.length > 0 && (
                <>
                  <Separator />
                  <InsightBox insights={post.puntosClaves} locale={locale} />
                </>
              )}
            </div>

            {/* Sidebar Column */}
            <aside
              className="lg:col-span-4 space-y-8"
              aria-label={
                locale === "es" ? "Compartir artículo" : "Share article"
              }
            >
              <ShareButtons title={post.titulo} locale={locale} />
            </aside>
          </div>
        </div>
      </article>

      {/* Recommended Articles */}
      {recommendedPosts.length > 0 && (
        <>
          <Separator />
          <RecommendedArticles posts={recommendedPosts} locale={locale} />
        </>
      )}

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}
