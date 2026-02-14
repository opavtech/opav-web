"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ShimmerButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function ShimmerButton({ href, children }: ShimmerButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-lg font-semibold text-lg transition-all duration-300 overflow-hidden font-['Inter'] hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, #d50058 0%, #a0003d 100%)",
        color: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Shimmer effect with subtle magenta */}
      <div
        className="absolute inset-0 opacity-70 animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 35%, rgba(196,28,116,0.35) 50%, rgba(255,255,255,0.15) 65%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: mounted ? "shimmer 1.8s infinite" : "none",
        }}
      ></div>

      {children}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </Link>
  );
}
