"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getStrapiMedia } from "@/lib/strapi";

interface ImageGalleryProps {
  galeria: any[];
  empresa: "OPAV" | "B&S";
  translations: {
    title: string;
    viewLarger: string;
    closeGallery: string;
    imageOf: string;
  };
}

export default function ImageGallery({
  galeria,
  empresa,
  translations,
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const ref = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isOPAV = empresa === "OPAV";
  const brandColor = isOPAV ? "#d50058" : "#0e7490";

  if (!galeria || galeria.length === 0) return null;

  // Extraer todas las imágenes del dynamic zone
  const allImages: any[] = [];
  galeria.forEach((item) => {
    if (item.__component === "galeria.galeria-opav" && item.imagenesSecundarias) {
      // Agregar todas las imágenes secundarias
      item.imagenesSecundarias.forEach((img: any) => {
        allImages.push(img);
      });
    } else if (item.__component === "galeria.comparacion-antes-despues") {
      // Agregar imagenAntes e imagenDespues
      if (item.imagenAntes) {
        allImages.push({
          ...item.imagenAntes,
          alternativeText: item.descripcionAntes || item.imagenAntes.alternativeText || "Antes"
        });
      }
      if (item.imagenDespues) {
        allImages.push({
          ...item.imagenDespues,
          alternativeText: item.descripcionDespues || item.imagenDespues.alternativeText || "Después"
        });
      }
    }
  });

  if (allImages.length === 0) return null;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "unset";
  };

  // Focus trap effect
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element
    firstElement?.focus();

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [selectedImageIndex]);

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  // Add keyboard listener
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
  }

  return (
    <>
      <section
        ref={ref}
        className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <div
                  className="w-12 h-1 mx-auto rounded-full"
                  style={{ backgroundColor: brandColor }}
                />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 font-['Inter']">
                {translations.title}
              </h2>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allImages.map((imagen, index) => {
                const imageUrl = getStrapiMedia(imagen.url || imagen, "medium");
                if (!imageUrl) return null;

                return (
                  <motion.div
                    key={imagen.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={
                        imagen.alternativeText ||
                        `${translations.imageOf} ${index + 1}`
                      }
                      fill
                      loading="lazy"
                      quality={85}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                          style={{ backgroundColor: `${brandColor}20` }}
                        >
                          <ZoomIn
                            className="w-6 h-6"
                            style={{ color: brandColor }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Border on hover */}
                    <div
                      className="absolute inset-0 rounded-xl ring-2 ring-inset ring-transparent group-hover:ring-current transition-all duration-300 pointer-events-none"
                      style={{ color: brandColor }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={translations.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 flex items-center justify-center"
              aria-label={translations.closeGallery}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-white text-sm font-light">
                {selectedImageIndex + 1} / {allImages.length}
              </span>
            </div>

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={
                    getStrapiMedia(
                      allImages[selectedImageIndex].url ||
                        allImages[selectedImageIndex],
                      "large"
                    ) || ""
                  }
                  alt={
                    allImages[selectedImageIndex].alternativeText ||
                    `${translations.imageOf} ${selectedImageIndex + 1}`
                  }
                  fill
                  quality={90}
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Caption if available */}
              {imagenes[selectedImageIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-center text-sm">
                    {imagenes[selectedImageIndex].caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
