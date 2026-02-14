"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  locale: string;
}

/**
 * Premium Table of Contents
 * Features:
 * - Auto-generated from h2, h3 headings
 * - Scroll spy with active section highlighting
 * - Smooth scroll navigation
 * - Sticky sidebar positioning
 * - Mobile responsive with toggle
 * - Accessibility compliant
 */
export default function TableOfContents({ locale }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<ToCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Extract headings from DOM
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = article.querySelectorAll("h2, h3");
    const items: ToCItem[] = [];

    headingElements.forEach((heading, index) => {
      const text = heading.textContent || "";
      const level = parseInt(heading.tagName[1]);

      // Generate ID if not present
      let id = heading.id;
      if (!id) {
        id = `heading-${index}`;
        heading.id = id;
      }

      items.push({ id, text, level });
    });

    setHeadings(items);
  }, []);

  // Scroll spy - track active section
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Smooth scroll to heading
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 100; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setIsOpen(false);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToHeading(id);
      }
    },
    [scrollToHeading]
  );

  if (headings.length === 0) return null;

  const title = locale === "es" ? "Tabla de Contenidos" : "Table of Contents";

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
        aria-label={
          isOpen ? "Close table of contents" : "Open table of contents"
        }
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Desktop Sticky Sidebar */}
      <aside
        className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto"
        aria-label={title}
      >
        <nav className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
            <span
              className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"
              aria-hidden="true"
            />
            {title}
          </h2>

          <ul className="space-y-1" role="list">
            {headings.map((heading, index) => (
              <motion.li
                key={heading.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={index}
                style={{
                  paddingLeft: `${(heading.level - 2) * 1}rem`,
                }}
              >
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  onKeyDown={(e) => handleKeyDown(e, heading.id)}
                  className={`
                    w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200
                    ${
                      activeId === heading.id
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 font-semibold border-l-2 border-blue-500"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                  aria-current={
                    activeId === heading.id ? "location" : undefined
                  }
                >
                  {heading.text}
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              aria-label={title}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                <ul className="space-y-1" role="list">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      style={{
                        paddingLeft: `${(heading.level - 2) * 1}rem`,
                      }}
                    >
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        onKeyDown={(e) => handleKeyDown(e, heading.id)}
                        className={`
                          w-full text-left text-sm py-2 px-3 rounded-lg transition-all
                          ${
                            activeId === heading.id
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 font-semibold"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }
                        `}
                        aria-current={
                          activeId === heading.id ? "location" : undefined
                        }
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
