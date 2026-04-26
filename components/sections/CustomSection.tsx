"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CustomData } from "@/lib/sections";

interface CustomSectionProps {
  id: string;
  title: string;
  data: CustomData;
  order: number;
}

export default function CustomSection({ id, title, data, order }: CustomSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id={id} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">0{order} — SECTION</p>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary">
            {title.toUpperCase()}
          </h2>
        </motion.div>

        {data.html && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="prose prose-invert max-w-none font-body text-text-secondary"
            dangerouslySetInnerHTML={{ __html: data.html }}
          />
        )}
      </div>
    </section>
  );
}
