"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Linkedin,
  Twitter,
  Link2,
  Check,
  Facebook,
  Mail,
} from "lucide-react";

interface ShareButtonsProps {
  title: string;
  locale: string;
}

/**
 * Premium Share Buttons with 3D animations
 * Features:
 * - Native Web Share API support
 * - Copy to clipboard
 * - Social media sharing
 * - 3D hover effects
 * - Accessibility compliant
 * - Analytics ready
 */
export default function ShareButtons({ title, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setCanShare(!!navigator.share);
  }, []);

  const handleNativeShare = async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title,
        url: currentUrl,
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (
    platform: "linkedin" | "twitter" | "facebook" | "email"
  ) => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    const urls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
    };

    if (platform === "email") {
      window.location.href = urls[platform];
    } else {
      window.open(
        urls[platform],
        "_blank",
        "width=600,height=400,noopener,noreferrer"
      );
    }
  };

  const shareLabel = locale === "es" ? "Compartir artículo" : "Share article";
  const copyLabel = locale === "es" ? "Copiar enlace" : "Copy link";
  const copiedLabel = locale === "es" ? "¡Copiado!" : "Copied!";

  const buttonVariants = {
    rest: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="sticky top-24 opacity-60 hover:opacity-100 transition-opacity"
      aria-label={shareLabel}
    >
      <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Share2 size={14} className="text-gray-500" aria-hidden="true" />
          <h3 className="font-medium text-xs text-gray-600 uppercase tracking-wide">
            {shareLabel}
          </h3>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-col gap-2">
          {/* Native Share (if supported) */}
          {canShare && (
            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium text-xs"
              style={{ perspective: "1000px" }}
              aria-label={shareLabel}
            >
              <Share2 size={14} />
              <span>{locale === "es" ? "Compartir" : "Share"}</span>
            </motion.button>
          )}

          {/* LinkedIn */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleShare("linkedin")}
            className="flex items-center gap-2 w-full px-3 py-2 bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg transition-colors shadow-sm hover:shadow-md font-medium text-xs"
            style={{ perspective: "1000px" }}
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={14} />
            <span>LinkedIn</span>
          </motion.button>

          {/* Twitter/X */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 w-full px-3 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors shadow-sm hover:shadow-md font-medium text-xs"
            style={{ perspective: "1000px" }}
            aria-label="Share on X (Twitter)"
          >
            <Twitter size={14} />
            <span>X (Twitter)</span>
          </motion.button>

          {/* Facebook */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2 w-full px-3 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg transition-colors shadow-sm hover:shadow-md font-medium text-xs"
            style={{ perspective: "1000px" }}
            aria-label="Share on Facebook"
          >
            <Facebook size={14} />
            <span>Facebook</span>
          </motion.button>

          {/* Email */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleShare("email")}
            className="flex items-center gap-2 w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md font-medium text-xs"
            style={{ perspective: "1000px" }}
            aria-label="Share via Email"
          >
            <Mail size={14} />
            <span>Email</span>
          </motion.button>

          {/* Copy Link */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={handleCopyLink}
            className="relative flex items-center justify-center gap-2 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors shadow-sm font-medium text-xs overflow-hidden"
            style={{ perspective: "1000px" }}
            aria-label={copyLabel}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} className="text-green-600" />
                  <span className="text-green-600">{copiedLabel}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Link2 size={14} />
                  <span>{copyLabel}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
