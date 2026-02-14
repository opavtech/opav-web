"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  name: string;
  position: string;
  quote: string;
}

interface CorporateTestimonialsProps {
  testimonials: Testimonial[];
}

export default function CorporateTestimonials({
  testimonials,
}: CorporateTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 8000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const variants = {
    enter: (direction: number) => ({
      scale: 0.88,
      opacity: 0,
      z: -150,
      filter: "blur(8px)",
      y: 30,
    }),
    center: {
      scale: 1,
      opacity: 1,
      z: 0,
      filter: "blur(0px)",
      y: 0,
    },
    exit: (direction: number) => ({
      scale: 0.88,
      opacity: 0,
      z: -150,
      filter: "blur(8px)",
      y: -30,
    }),
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Testimonial Cards */}
      <div className="relative overflow-hidden min-h-[350px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 1.0,
              ease: [0.25, 0.1, 0.25, 1],
              scale: { duration: 1.2 },
              z: { duration: 1.2 },
            }}
            className="absolute w-full px-4"
          >
            {/* Glassmorphism Card with subtle magenta accent */}
            <div
              className="relative bg-white/80 backdrop-blur-md rounded-2xl p-10 md:p-14 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(249,250,251,0.6) 100%)",
                border: "1px solid rgba(196,28,116,0.12)",
                boxShadow: "0 18px 45px rgba(196,28,116,0.08)",
              }}
            >
              {/* Initial Circle */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center bg-white">
                  <span className="text-xl font-bold text-gray-700 font-['Inter']">
                    {getInitials(testimonials[currentIndex].name)}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="relative mb-8">
                <div className="absolute -top-4 -left-2 text-6xl text-gray-300 font-serif leading-none">
                  "
                </div>
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center font-['Inter'] font-light relative z-10 px-4">
                  {testimonials[currentIndex].quote}
                </p>
                <div className="absolute -bottom-8 -right-2 text-6xl text-gray-300 font-serif leading-none">
                  "
                </div>
              </blockquote>

              {/* Author Info */}
              <div className="text-center mt-10">
                <p className="text-lg font-semibold text-gray-900 font-['Inter']">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-sm text-gray-600 font-['Inter'] mt-1">
                  {testimonials[currentIndex].position}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Navigation with subtle magenta accent */}
      <div className="flex justify-center gap-2 mt-12">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-10 h-2"
                : "w-2 h-2 hover:bg-gray-500"
            }`}
            style={{
              backgroundColor:
                index === currentIndex
                  ? "rgba(196,28,116,0.70)"
                  : "rgba(156,163,175,1)",
            }}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
