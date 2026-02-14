/**
 * Animation Utilities
 * GSAP and Framer Motion configuration for editorial animations
 * Performance optimized with proper cleanup and reduced motion support
 */

import { Variants } from "framer-motion";

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Easing curves for smooth animations
 */
export const easing = {
  // Smooth and natural
  smooth: [0.22, 1, 0.36, 1],
  // Bouncy for micro-interactions
  bouncy: [0.68, -0.55, 0.265, 1.55],
  // Sharp for quick transitions
  sharp: [0.4, 0, 0.2, 1],
  // Gentle for editorial content
  gentle: [0.25, 0.46, 0.45, 0.94],
} as const;

/**
 * Framer Motion Variants
 */

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.smooth },
  },
};

// Fade in with scale
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easing.smooth },
  },
};

// Stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Letter reveal animation
export const letterReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: easing.smooth,
    },
  }),
};

// Slide from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easing.smooth },
  },
};

// Slide from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easing.smooth },
  },
};

// Image reveal with scale
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: easing.gentle },
  },
};

// Quote reveal
export const quoteReveal: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: easing.smooth },
  },
};

/**
 * GSAP Animation Helpers
 */

// Parallax scroll effect
export const parallaxConfig = {
  speed: 0.5,
  ease: "none",
};

// Smooth scroll configuration
export const smoothScrollConfig = {
  duration: 1.2,
  ease: "power3.inOut",
};

// Text reveal animation
export const textRevealConfig = {
  duration: 0.8,
  stagger: 0.03,
  ease: "power3.out",
};

/**
 * Intersection Observer options for lazy animations
 */
export const intersectionOptions = {
  threshold: 0.1,
  triggerOnce: true,
  rootMargin: "-50px 0px",
};

/**
 * Get animation props with reduced motion support
 */
export const getAnimationProps = (variants: Variants) => {
  if (prefersReducedMotion()) {
    return {
      initial: "visible",
      animate: "visible",
      variants,
    };
  }
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.3 },
    variants,
  };
};
