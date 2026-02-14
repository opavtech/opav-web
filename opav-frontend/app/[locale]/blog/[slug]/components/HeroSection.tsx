"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { getStrapiMedia } from "@/lib/strapi";
import { BlogPost } from "@/types/blog";
import { Calendar, Clock, User, ChevronRight, Home } from "lucide-react";
import { letterReveal, easing } from "@/lib/animations";

interface HeroSectionProps {
  post: BlogPost;
  locale: string;
}

export default function HeroSection({ post, locale }: HeroSectionProps) {
  const imageUrl = getStrapiMedia(post.imagenPrincipal?.url);
  const authorAvatarSrc = post.author?.avatar?.url
    ? getStrapiMedia(post.author.avatar.url)
    : null;
  const sectionRef = useRef<HTMLElement>(null);
  const [titleChars, setTitleChars] = useState<string[]>([]);

  // Parallax scroll effects - suave sin fade-out para permitir lectura
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, 200]);
  const imageScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const contentY = useTransform(scrollY, [0, 600], [0, -50]);

  // Split title into characters for letter-reveal animation
  useEffect(() => {
    setTitleChars(post.titulo.split(""));
  }, [post.titulo]);

  const formattedDate = new Date(post.fechaPublicacion).toLocaleDateString(
    locale,
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24 pb-16 overflow-hidden"
      aria-label={
        locale === "es" ? "Encabezado del artículo" : "Article header"
      }
    >
      {/* Atmospheric background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[url('/patterns/noise.png')] mix-blend-multiply pointer-events-none"
        aria-hidden="true"
      />

      {/* Glassmorphism Breadcrumbs */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 lg:left-12 z-10"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-white/20 shadow-lg text-xs">
          <li>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={locale === "es" ? "Inicio" : "Home"}
            >
              <Home size={14} />
            </Link>
          </li>
          {post.category && (
            <>
              <ChevronRight
                size={12}
                className="text-gray-400"
                aria-hidden="true"
              />
              <li
                className="text-gray-900 font-medium truncate max-w-[200px]"
                aria-current="page"
              >
                {post.category.name}
              </li>
            </>
          )}
        </ol>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          {/* Left Column: Content */}
          <motion.div
            style={{ y: contentY }}
            className="lg:col-span-8 flex flex-col justify-center space-y-8"
          >
            {/* Title with letter-reveal animation */}
            <h1
              className="font-serif text-4xl lg:text-5xl xl:text-6xl text-gray-900 leading-[1.15] tracking-tight"
              lang={locale}
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {titleChars.map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterReveal}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>

            {/* Summary */}
            {post.resumen && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: easing.smooth }}
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light"
                style={{ fontFamily: "var(--font-eb-garamond)" }}
              >
                {post.resumen}
              </motion.p>
            )}

            {/* Metadata Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: easing.smooth }}
              className="flex flex-wrap items-center gap-6 text-sm text-gray-500"
            >
              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar
                  size={16}
                  className="text-gray-400"
                  aria-hidden="true"
                />
                <time dateTime={post.fechaPublicacion}>{formattedDate}</time>
              </div>

              {/* Reading time */}
              {post.tiempoLectura && (
                <div className="flex items-center gap-2">
                  <Clock
                    size={16}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                  <span>
                    {post.tiempoLectura}{" "}
                    {locale === "es" ? "min de lectura" : "min read"}
                  </span>
                </div>
              )}

              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3">
                  {authorAvatarSrc && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                      <Image
                        src={authorAvatarSrc}
                        alt={`${post.author.name} avatar`}
                        fill
                        className="object-cover"
                        sizes="32px"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User
                      size={16}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-gray-700">
                      {post.author.name}
                      {post.author.role && (
                        <span className="text-gray-400 font-normal ml-1">
                          · {post.author.role}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Editorial Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: easing.smooth }}
              className="pt-8 border-t border-gray-200/50"
            >
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logos/opav-logo.png"
                  alt="OPAV"
                  fill
                  className="object-contain"
                  loading="eager"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Image with Parallax */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="lg:col-span-4 relative"
          >
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: easing.gentle }}
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={imageUrl}
                  alt={post.imagenPrincipal?.alternativeText || post.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority
                  quality={85}
                />

                {/* Dynamic gradient overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Caption if available */}
                {post.imagenPrincipal?.caption && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="absolute bottom-4 left-4 right-4 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg"
                  >
                    {post.imagenPrincipal.caption}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl -z-10"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
