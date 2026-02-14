/**
 * Editorial Typography System
 * Premium fonts optimized with next/font
 * Performance: Preloaded, self-hosted, optimized
 */

import { Inter, Playfair_Display, EB_Garamond } from "next/font/google";

/**
 * Inter - Sans-serif for UI elements and metadata
 * Variable font for optimal performance
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
});

/**
 * Playfair Display - Serif for headlines and titles
 * Elegant editorial feel
 */
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  preload: true,
  adjustFontFallback: true,
});

/**
 * EB Garamond - Serif for body text
 * Optimized for readability in long-form content
 */
export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: true,
  adjustFontFallback: true,
});

/**
 * Font class names for combining all fonts
 */
export const fontVariables = `${inter.variable} ${playfairDisplay.variable} ${ebGaramond.variable}`;
