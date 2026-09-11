"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SkillsData } from "@/lib/sections";
import { useTranslation } from "@/lib/i18n";

interface SkillsSectionProps {
  data: SkillsData;
}

export default function SkillsSection({ data }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t, lang } = useTranslation();

  return (
    <section id="skills" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">{t("skills_label")}</p>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary">
            STACK
          </h2>
        </motion.div>

        {/* Overview grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {data.categories.map((cat) => (
            <div key={lang === "en" && cat.nameEn ? cat.nameEn : cat.name} className="space-y-3">
              <p className="font-mono text-xs text-accent-primary tracking-wider">
                {lang === "en" && cat.nameEn ? cat.nameEn : cat.name}
              </p>
              <div className="space-y-1.5">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="font-body text-xs text-text-secondary">{item.name}</span>
                    <span className="font-mono text-[10px] text-text-muted">{item.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
