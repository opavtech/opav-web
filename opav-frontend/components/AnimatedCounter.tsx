"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  className = "",
  suffix = "",
  prefix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "-100px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isInView) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || duration <= 0) {
      el.textContent = `${prefix}${Math.floor(value).toLocaleString()}${suffix}`;
      return;
    }

    const from = 0;
    const to = value;
    const durationMs = duration * 1000;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let rafId = 0;
    let startTime: number | null = null;

    const frame = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      const current = from + (to - from) * eased;

      el.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;

      if (progress < 1) {
        rafId = window.requestAnimationFrame(frame);
      }
    };

    rafId = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(rafId);
  }, [duration, isInView, prefix, suffix, value]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-500 will-change-transform ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {prefix}0{suffix}
    </div>
  );
}
