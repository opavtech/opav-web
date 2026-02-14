"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getStrapiMedia } from "@/lib/strapi";
import { imageReveal } from "@/lib/animations";

interface ImageGalleryProps {
  images: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    caption?: string;
  }>;
}

/**
 * Premium Image Gallery with Lightbox
 * Features:
 * - Lazy loading with blur placeholder
 * - Lightbox modal with keyboard navigation
 * - Zoom hover effect
 * - Accessibility compliant (ARIA, keyboard)
 * - Performance optimized
 */
export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  }, [selectedIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrevious, handleNext]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-12">
        {images.map((image, index) => {
          const imageUrl = getStrapiMedia(image.url);
          if (!imageUrl) return null;

          return (
            <motion.button
              key={image.id}
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedIndex(index)}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View image ${index + 1}: ${
                image.alternativeText || ""
              }`}
            >
              <Image
                src={imageUrl}
                alt={image.alternativeText || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  size={32}
                  aria-hidden="true"
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Close"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              </>
            )}

            {/* Image container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={getStrapiMedia(images[selectedIndex].url) || ""}
                alt={
                  images[selectedIndex].alternativeText ||
                  `Image ${selectedIndex + 1}`
                }
                fill
                className="object-contain"
                sizes="100vw"
                quality={90}
                priority
              />

              {/* Caption */}
              {images[selectedIndex].caption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
                >
                  <p className="text-white text-center text-lg">
                    {images[selectedIndex].caption}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
