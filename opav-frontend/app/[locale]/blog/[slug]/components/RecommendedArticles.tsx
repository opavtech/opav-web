"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getStrapiMedia } from "@/lib/strapi";
import { BlogPost } from "@/types/blog";

interface RecommendedArticlesProps {
  posts: BlogPost[];
  locale: string;
}

export default function RecommendedArticles({
  posts,
  locale,
}: RecommendedArticlesProps) {
  if (!posts || posts.length === 0) return null;

  const title =
    locale === "es" ? "Artículos Recomendados" : "Recommended Articles";

  return (
    <section className="relative bg-[#FAFBFC] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Título de sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-['Inter'] font-bold text-3xl lg:text-4xl text-gray-900">
            {title}
          </h2>
        </motion.div>

        {/* Grid de artículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, index) => {
            const imageUrl = getStrapiMedia(post.imagenPrincipal?.url);
            const postUrl = `/${locale}/blog/${post.slug}`;

            const formattedDate = new Date(
              post.fechaPublicacion
            ).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link href={postUrl} className="group block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500">
                    {/* Imagen */}
                    <div className="relative w-full h-[240px] overflow-hidden bg-gray-100">
                      {imageUrl && (
                        <>
                          <Image
                            src={imageUrl}
                            alt={post.titulo}
                            fill
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </>
                      )}

                      {/* Categoría */}
                      {post.category && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-3 py-1 text-xs font-semibold uppercase rounded-full bg-white/90 backdrop-blur-sm shadow border border-gray-200">
                            {post.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                      {/* Metadata */}
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

                      {/* Título */}
                      <h3 className="font-['Inter'] font-bold text-xl text-gray-900 mb-3 group-hover:text-[#d50058] transition-colors line-clamp-2">
                        {post.titulo}
                      </h3>

                      {/* Resumen */}
                      {post.resumen && (
                        <p className="font-['Inter'] text-sm text-gray-600 line-clamp-2 mb-4">
                          {post.resumen}
                        </p>
                      )}

                      {/* Footer con autor y flecha */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        {post.author && (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
                              {post.author.name.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-700">
                              {post.author.name}
                            </span>
                          </div>
                        )}

                        <ArrowUpRight
                          size={20}
                          className="text-[#d50058] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
