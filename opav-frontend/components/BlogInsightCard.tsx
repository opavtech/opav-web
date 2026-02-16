"use client";

import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import { BlogPost } from "@/types/blog";
import { ArrowUpRight } from "lucide-react";

interface Props {
  post: BlogPost;
  locale: string;
  isCenter?: boolean;

  /** NUEVO: Props que el carrusel necesita */
  position?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

function BlogInsightCard({
  post,
  locale,
  isCenter = false,
  className,
  style,
}: Props) {
  const imageUrl = getStrapiMedia(post.imagenPrincipal?.url);
  const postUrl = `/${locale}/blog/${post.slug}`;

  const formattedDate = new Date(post.fechaPublicacion).toLocaleDateString(
    locale,
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className={`relative ${className ?? ""}`} style={style}>
      <Link href={postUrl} className="group block">
        <article
          className={`relative bg-white rounded-xl overflow-hidden shadow-xl flex flex-col ${
            isCenter
              ? "w-[90vw] max-w-[440px] h-[420px] md:w-[440px] md:h-[500px]"
              : "w-[380px] h-[460px]"
          }`}
        >
          {/* Cinematic Glow */}
          {isCenter && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(196,28,116,0.1), transparent 70%)",
              }}
            />
          )}

          {/* Imagen */}
          <div className="relative w-full h-[200px] overflow-hidden bg-gray-100">
            {imageUrl && (
              <>
                <Image
                  src={imageUrl}
                  alt={post.titulo}
                  fill
                  className="object-cover object-center min-w-full min-h-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 450px"
                  style={{
                    objectPosition: "50% 50%",
                  }}
                />
                {/* Multi-layer overlay system */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/10"></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent"></div>
              </>
            )}

            {/* Categoria */}
            {post.category && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-3 py-1 text-xs font-semibold uppercase rounded-full bg-white/90 backdrop-blur-sm shadow border border-gray-200">
                  {post.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <time>{formattedDate}</time>
              {post.tiempoLectura && (
                <>
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span>
                    {post.tiempoLectura}{" "}
                    {locale === "es" ? "min lectura" : "min read"}
                  </span>
                </>
              )}
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-[rgb(196,28,116)] transition-colors line-clamp-2">
              {post.titulo}
            </h3>

            {isCenter && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {post.resumen}
              </p>
            )}

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
              {post.author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
                    {post.author.name.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-700">
                    {post.author.name}
                  </span>
                </div>
              )}

              <ArrowUpRight size={20} className="text-[rgb(196,28,116)]" />
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

export default BlogInsightCard;
