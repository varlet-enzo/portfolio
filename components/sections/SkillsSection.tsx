"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SkillsData } from "@/lib/sections";
import SkillBar from "@/components/ui/SkillBar";
import { useTranslation } from "@/lib/i18n";

interface SkillsSectionProps {
  data: SkillsData;
}

export default function SkillsSection({ data }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

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

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {data.categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(i)}
              className={`font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200 border ${
                activeTab === i
                  ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                  : "border-[rgba(240,246,252,0.08)] text-text-muted hover:text-text-secondary hover:border-text-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-5">
          {data.categories[activeTab]?.items.map((skill, i) => (
            <motion.div
              key={`${activeTab}-${skill.name}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <SkillBar skill={skill} delay={i * 0.05} />
            </motion.div>
          ))}
        </div>

        {/* All categories overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-12 border-t border-[rgba(240,246,252,0.06)]"
        >
          <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-8">
            {t("skills_overview")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.categories.map((cat) => (
              <div key={cat.name} className="space-y-3">
                <p className="font-mono text-xs text-accent-primary tracking-wider">{cat.name}</p>
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
