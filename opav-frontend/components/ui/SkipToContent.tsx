"use client";

import Link from "next/link";

export default function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className="
        fixed top-4 left-4 z-[9999] px-6 py-3 bg-[#d50058] text-white font-semibold rounded-lg
        shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d50058]/50
        -translate-y-24 focus:translate-y-0 transition-transform duration-200
      "
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById("main-content");
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
    >
      Saltar al contenido principal
    </Link>
  );
}
