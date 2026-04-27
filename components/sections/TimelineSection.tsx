"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { TimelineData } from "@/lib/sections";
import TimelineEntryComponent from "@/components/ui/TimelineEntry";
import { useTranslation } from "@/lib/i18n";

interface TimelineSectionProps {
  data: TimelineData;
}

export default function TimelineSection({ data }: TimelineSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="timeline" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">{t("timeline_label")}</p>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary">
            TIMELINE
          </h2>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Vertical line desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-[rgba(240,246,252,0.06)]">
            <motion.div
              className="absolute top-0 left-0 w-full bg-accent-primary origin-top"
              style={{ height: lineHeight, boxShadow: "0 0 8px rgba(232,255,71,0.4)" }}
            />
          </div>

          {/* Vertical line mobile */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-[1px] bg-[rgba(240,246,252,0.06)]">
            <motion.div
              className="absolute top-0 left-0 w-full bg-accent-primary origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12 md:space-y-0">
            {data.entries.map((entry, i) => (
              <div
                key={entry.id}
                className={`relative pl-12 md:pl-0 md:flex ${
                  i % 2 === 0 ? "md:justify-start" : "md:justify-end"
                } md:mb-12`}
              >
                {/* Mobile dot */}
                <div
                  className="md:hidden absolute left-4 top-6 w-3 h-3 -translate-x-1/2 rounded-full border-2 border-accent-primary bg-bg-primary"
                  style={{ boxShadow: "0 0 8px rgba(232,255,71,0.5)" }}
                />

                {/* Desktop: half-width card */}
                <div className={`md:w-[46%] ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                  <TimelineEntryComponent
                    entry={entry}
                    index={i}
                    isLeft={i % 2 !== 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
