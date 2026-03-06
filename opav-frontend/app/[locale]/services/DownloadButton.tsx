"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DownloadButtonProps {
  children: React.ReactNode;
  className: string;
  unavailableMessage: string;
  style?: React.CSSProperties;
}

export default function DownloadButton({
  children,
  className,
  unavailableMessage,
  style,
}: DownloadButtonProps) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 3500);
  };

  return (
    <div className="relative inline-block">
      <button onClick={handleClick} className={className} style={style}>
        {children}
      </button>

      <AnimatePresence>
        {visible && (
          <>
            {/* Mobile: toast fijo en parte inferior, z-60 > navbar z-30 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="sm:hidden fixed bottom-6 left-4 right-4 z-60 pointer-events-none"
            >
              <div className="flex items-center gap-3 bg-[#1a1f26] text-white text-sm font-medium px-4 py-3.5 rounded-2xl shadow-2xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="leading-snug">{unavailableMessage}</span>
              </div>
            </motion.div>

            {/* Desktop: tooltip sobre el botón */}
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-60 pointer-events-none"
            >
              <div className="flex items-center gap-2.5 bg-[#1a1f26] text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap">
                <div className="w-7 h-7 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>{unavailableMessage}</span>
              </div>
              <div className="flex justify-center">
                <div className="w-2.5 h-2.5 bg-[#1a1f26] rotate-45 -mt-1.5 border-r border-b border-white/10" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
