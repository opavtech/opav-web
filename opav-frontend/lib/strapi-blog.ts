/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlogPost, BlogAuthor, BlogCategory } from "@/types/blog";

/**
 * Transform Strapi v5 blog post data to our BlogPost interface
 */
export function transformStrapiPost(strapiData: any): BlogPost | null {
  if (!strapiData) return null;

  const data = strapiData;

  // Extract tags as array of strings
  const tags = data.tags?.map((tag: any) => tag.name) || [];

  return {
    id: data.id,
    titulo: data.titulo,
    slug: data.slug,
    resumen: data.resumen,
    contenido: data.contenido,
    parrafoIntroductorio: data.parrafoIntroductorio,
    puntosClaves: data.puntosClaves,
    fechaPublicacion: data.fechaPublicacion,
    tiempoLectura: data.tiempoLectura,
    isFeatured: data.isFeatured || false,
    seoTitle: data.seoTitle,
    metaDescription: data.metaDescription,
    imagenPrincipal: data.imagenPrincipal
      ? {
          id: data.imagenPrincipal.id,
          url: data.imagenPrincipal.url,
          alternativeText: data.imagenPrincipal.alternativeText,
          caption: data.imagenPrincipal.caption,
          width: data.imagenPrincipal.width,
          height: data.imagenPrincipal.height,
          formats: data.imagenPrincipal.formats,
        }
      : {
          id: 0,
          url: "",
        },
    imagenesContenido: data.imagenesContenido?.map((img: any) => ({
      id: img.id,
      url: img.url,
      alternativeText: img.alternativeText,
      caption: img.caption,
    })),
    openGraphImage: data.openGraphImage
      ? {
          id: data.openGraphImage.id,
          url: data.openGraphImage.url,
          width: data.openGraphImage.width,
          height: data.openGraphImage.height,
        }
      : undefined,
    category: data.category
      ? {
          id: data.category.id,
          name: data.category.name,
          slug: data.category.slug,
          description: data.category.description,
          locale: data.category.locale || data.locale,
        }
      : undefined,
    author: data.author
      ? {
          id: data.author.id,
          name: data.author.name,
          role: data.author.role,
          bio: data.author.bio,
          avatar: data.author.avatar,
          social_x: data.author.social_x,
          social_linkedin: data.author.social_linkedin,
        }
      : undefined,
    tags,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    locale: data.locale,
  };
}

/**
 * Transform array of Strapi posts
 */
export function transformStrapiPosts(strapiResponse: any): BlogPost[] {
  if (!strapiResponse?.data || !Array.isArray(strapiResponse.data)) {
    return [];
  }

  return strapiResponse.data
    .map((item: any) => transformStrapiPost(item))
    .filter((post: BlogPost | null): post is BlogPost => post !== null);
}
