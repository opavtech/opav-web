import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales OPAV - Magenta/Rubine Red
        // Pantone Rubine Red: C10 M100 Y38 K0 / RGB 213 0 88 / #d50058
        primary: {
          50: "#fef1f7",   // Tono muy claro
          100: "#fee5f0",  // Tono claro
          200: "#feccdf",  // Tono claro medio
          300: "#fda3c4",  // Tono medio claro
          400: "#fb6a9d",  // Tono medio
          500: "#f5347b",  // Tono medio oscuro
          600: "#d50058",  // Color principal OPAV - Rubine Red
          700: "#b8004b",  // Tono oscuro
          800: "#98003e",  // Tono muy oscuro
          900: "#7d0035",  // Tono más oscuro
          950: "#4b001e",  // Tono ultra oscuro
        },
        // Colores secundarios - Gris medio
        // Pantone 431: C68 M52 Y42 K16 / RGB 91 103 112 / #5b6770
        secondary: {
          50: "#f6f7f8",   // Tono muy claro
          100: "#edeef0",  // Tono claro
          200: "#d7dade",  // Tono claro medio
          300: "#b5bbc2",  // Tono medio claro
          400: "#8d95a0",  // Tono medio
          500: "#6f7985",  // Tono medio oscuro
          600: "#5b6770",  // Color secundario - Gris Pantone 431
          700: "#4d555c",  // Tono oscuro
          800: "#42484e",  // Tono muy oscuro
          900: "#3a3e43",  // Tono más oscuro
          950: "#252729",  // Tono ultra oscuro
        },
        // Color de acento (usando el magenta)
        accent: {
          light: "#fb6a9d",
          DEFAULT: "#d50058",
          dark: "#b8004b",
        },
        // Alias para mantener compatibilidad
        magenta: {
          DEFAULT: "#d50058",
          light: "#f5347b",
          dark: "#b8004b",
        },
        gray: {
          DEFAULT: "#5b6770",
          light: "#8d95a0",
          dark: "#4d555c",
        },
      },
      fontFamily: {
        // Tipografía corporativa OPAV
        sans: ["Copperplate", "Copperplate Gothic Light", "Georgia", "serif"],
        heading: ["Copperplate", "Copperplate Gothic Light", "Georgia", "serif"],
        body: ["Copperplate", "Copperplate Gothic Light", "Georgia", "serif"],
        // Tipografía editorial para blog
        serif: ["IBM Plex Serif", "Georgia", "serif"],
        editorial: ["IBM Plex Serif", "Georgia", "serif"],
        caslon: "var(--font-libre-caslon)",
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out',
        fadeIn: 'fadeIn 0.8s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
