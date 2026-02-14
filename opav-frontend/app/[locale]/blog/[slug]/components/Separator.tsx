"use client";

import { motion } from "framer-motion";

export default function Separator() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="my-16"
    >
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </motion.div>
  );
}
