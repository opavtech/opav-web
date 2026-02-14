/**
 * Certificacion type definition
 * Matches Strapi certificacion content type schema
 */

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface Certificacion {
  id: number;
  documentId?: string;
  nombre: string;
  descripcion: string;
  logo: StrapiMedia;
  fechaEmision: string | null;
  fechaVencimiento: string | null;
  vigente: boolean;
  entidadEmisora?: string;
  destacado: boolean;
  queAporta?: string;
  // Strapi metadata
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface CertificacionesApiResponse {
  data: Certificacion[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
