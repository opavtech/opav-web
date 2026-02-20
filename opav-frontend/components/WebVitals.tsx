/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from "web-vitals";

export function WebVitals() {
  useEffect(() => {
    const sendToAnalytics = (metric: Metric) => {
      console.log(`${metric.name}:`, metric);
      // Enviar a Google Analytics si está disponible
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "web_vitals", {
          event_category: "Web Vitals",
          event_label: metric.name,
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_delta: metric.delta,
        });
      }
    };

    // Core Web Vitals
    onCLS(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);

    // Other metrics
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}
