"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface CounterItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: string;
  index: number;
  decimals?: number;
}

function CounterItem({
  value,
  suffix = "",
  prefix = "",
  label,
  icon,
  index,
  decimals = 0,
}: CounterItemProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || hasAnimated) {
      if (numberRef.current && !hasAnimated) {
        numberRef.current.textContent = `${prefix}${value}${suffix}`;
        setHasAnimated(true);
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && numberRef.current) {
          setHasAnimated(true);

          // GSAP counter animation
          const obj = { value: 0 };
          gsap.to(obj, {
            value: value,
            duration: 2.5,
            ease: "power2.out",
            delay: index * 0.15,
            onUpdate: () => {
              if (numberRef.current) {
                const displayValue =
                  decimals > 0
                    ? obj.value.toFixed(decimals)
                    : Math.floor(obj.value);
                numberRef.current.textContent = `${prefix}${displayValue}${suffix}`;
              }
            },
          });

          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: "0px" },
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [
    value,
    suffix,
    prefix,
    index,
    hasAnimated,
    prefersReducedMotion,
    decimals,
  ]);

  return (
    <motion.div
      ref={counterRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : index * 0.1,
        ease: "easeOut",
      }}
      className="flex flex-col items-center text-center"
    >
      {/* Icon */}
      <motion.div
        className="text-5xl mb-4"
        whileHover={{
          scale: prefersReducedMotion ? 1 : 1.1,
          rotate: prefersReducedMotion ? 0 : 5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      {/* Counter */}
      <div className="text-5xl font-bold text-primary-600 mb-2 font-['Inter']">
        <span
          ref={numberRef}
          style={{ willChange: hasAnimated ? "auto" : "contents" }}
        >
          {prefix}0{suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-gray-700 font-['Inter'] text-lg">{label}</p>
    </motion.div>
  );
}

interface AnimatedCountersProps {
  counters: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    icon: string;
    decimals?: number;
  }>;
}

export default function AnimatedCounters({ counters }: AnimatedCountersProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      {counters.map((counter, index) => (
        <CounterItem key={index} {...counter} index={index} />
      ))}
    </div>
  );
}
