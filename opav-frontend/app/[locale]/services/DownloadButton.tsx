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
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-4 right-4 z-50 pointer-events-none sm:absolute sm:bottom-full sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:mb-3"
          >
            <div className="flex items-center gap-2.5 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl">
              <svg
                className="w-4 h-4 text-amber-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="leading-snug">{unavailableMessage}</span>
            </div>
            {/* Arrow - solo visible en desktop */}
            <div className="hidden sm:flex justify-center">
              <div className="w-2.5 h-2.5 bg-gray-900 rotate-45 -mt-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
