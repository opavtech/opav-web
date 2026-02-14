import { MetadataRoute } from "next";
import { getCasosExito } from "@/lib/strapi";
import { transformStrapiPosts } from "@/lib/strapi-blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.opav.com.co";
  const locales = ["es", "en"];

  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          es: `${baseUrl}/es`,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/es/casos-exito`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/es/casos-exito`,
          en: `${baseUrl}/en/casos-exito`,
        },
      },
    },
    {
      url: `${baseUrl}/en/casos-exito`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/es/casos-exito`,
          en: `${baseUrl}/en/casos-exito`,
        },
      },
    },
    // Blog routes
    {
      url: `${baseUrl}/es/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/es/blog`,
          en: `${baseUrl}/en/blog`,
        },
      },
    },
  ];

  // Obtener casos de éxito dinámicos
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Obtener casos en español
    const casosES = await getCasosExito("es");
    const casosEN = await getCasosExito("en");

    // Obtener blog posts
    const blogPostsES = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?locale=es&populate[0]=author&pagination[limit]=100`,
      { next: { revalidate: 3600 } }
    ).then((res) => (res.ok ? res.json() : { data: [] }));

    const blogPostsEN = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?locale=en&populate[0]=author&pagination[limit]=100`,
      { next: { revalidate: 3600 } }
    ).then((res) => (res.ok ? res.json() : { data: [] }));

    // Crear un mapa de casos por documentId para enlazar localizaciones
    const casosByDocumentId = new Map<string, { es?: any; en?: any }>();

    casosES.data?.forEach((caso: any) => {
      const docId = caso.documentId;
      if (!casosByDocumentId.has(docId)) {
        casosByDocumentId.set(docId, {});
      }
      casosByDocumentId.get(docId)!.es = caso;
    });

    casosEN.data?.forEach((caso: any) => {
      const docId = caso.documentId;
      if (!casosByDocumentId.has(docId)) {
        casosByDocumentId.set(docId, {});
      }
      casosByDocumentId.get(docId)!.en = caso;
    });

    // Generar entradas del sitemap con alternates
    casosByDocumentId.forEach((casos, documentId) => {
      const esSlug = casos.es?.Slug;
      const enSlug = casos.en?.Slug;
      const updatedAt = casos.es?.updatedAt || casos.en?.updatedAt;

      // Si existe la versión en español
      if (esSlug) {
        dynamicRoutes.push({
          url: `${baseUrl}/es/casos-exito/${esSlug}`,
          lastModified: updatedAt ? new Date(updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: {
              es: `${baseUrl}/es/casos-exito/${esSlug}`,
              ...(enSlug && { en: `${baseUrl}/en/casos-exito/${enSlug}` }),
            },
          },
        });
      }

      // Si existe la versión en inglés
      if (enSlug) {
        dynamicRoutes.push({
          url: `${baseUrl}/en/casos-exito/${enSlug}`,
          lastModified: updatedAt ? new Date(updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: {
              ...(esSlug && { es: `${baseUrl}/es/casos-exito/${esSlug}` }),
              en: `${baseUrl}/en/casos-exito/${enSlug}`,
            },
          },
        });
      }
    });

    // Generar entradas para blog posts
    const blogPostsByDocumentId = new Map<string, { es?: any; en?: any }>();

    blogPostsES.data?.forEach((post: any) => {
      const docId = post.documentId;
      if (!blogPostsByDocumentId.has(docId)) {
        blogPostsByDocumentId.set(docId, {});
      }
      blogPostsByDocumentId.get(docId)!.es = post;
    });

    blogPostsEN.data?.forEach((post: any) => {
      const docId = post.documentId;
      if (!blogPostsByDocumentId.has(docId)) {
        blogPostsByDocumentId.set(docId, {});
      }
      blogPostsByDocumentId.get(docId)!.en = post;
    });

    blogPostsByDocumentId.forEach((posts) => {
      const esSlug = posts.es?.slug;
      const enSlug = posts.en?.slug;
      const publishedAt =
        posts.es?.fechaPublicacion || posts.en?.fechaPublicacion;
      const updatedAt = posts.es?.updatedAt || posts.en?.updatedAt;

      if (esSlug) {
        dynamicRoutes.push({
          url: `${baseUrl}/es/blog/${esSlug}`,
          lastModified: updatedAt
            ? new Date(updatedAt)
            : publishedAt
            ? new Date(publishedAt)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: {
              es: `${baseUrl}/es/blog/${esSlug}`,
              ...(enSlug && { en: `${baseUrl}/en/blog/${enSlug}` }),
            },
          },
        });
      }

      if (enSlug && enSlug !== esSlug) {
        dynamicRoutes.push({
          url: `${baseUrl}/en/blog/${enSlug}`,
          lastModified: updatedAt
            ? new Date(updatedAt)
            : publishedAt
            ? new Date(publishedAt)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/blog/${enSlug}`,
              ...(esSlug && { es: `${baseUrl}/es/blog/${esSlug}` }),
            },
          },
        });
      }
    });
  } catch (error) {
    console.error("Error generando sitemap para casos de éxito:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
