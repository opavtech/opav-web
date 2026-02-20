/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  resumen: string;
  contenido: any; // Rich text content from Strapi
  parrafoIntroductorio?: string; // Lead paragraph
  puntosClaves?: string[]; // Key insights array
  fechaPublicacion: string;
  tiempoLectura?: number;
  isFeatured: boolean;
  seoTitle?: string;
  metaDescription?: string;
  imagenPrincipal: {
    id: number;
    url: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: any;
  };
  imagenesContenido?: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    caption?: string;
  }>;
  openGraphImage?: {
    id: number;
    url: string;
    width?: number;
    height?: number;
    alternativeText?: string;
    caption?: string;
    mime?: string;
  };
  category?: BlogCategory;
  author?: BlogAuthor;
  tags?: string[]; // Array of tag strings for SEO
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  locale: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  avatar?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  social_x?: string;
  social_linkedin?: string;
}

export interface BlogSettings {
  id: number;
  blogTitle: string;
  blogDescription?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSeoImage?: {
    id: number;
    url: string;
    width?: number;
    height?: number;
  };
  locale: string;
}
