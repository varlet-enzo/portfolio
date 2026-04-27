"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AboutData } from "@/lib/sections";
import { MapPin, Calendar, Clock, BookOpen, Download, Gamepad2 } from "lucide-react";
import { useTranslation, TranslationKey } from "@/lib/i18n";

interface AboutSectionProps {
  data: AboutData;
}

const detailIcons = {
  formation: BookOpen,
  localisation: MapPin,
  disponibilite: Calendar,
  rythme: Clock,
};

const detailLabelKeys: Record<string, TranslationKey> = {
  formation: "about_info_formation",
  localisation: "about_info_localisation",
  disponibilite: "about_info_disponibilite",
  rythme: "about_info_rythme",
};

export default function AboutSection({ data }: AboutSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t, lang } = useTranslation();

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">{t("about_label")}</p>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary">
            {t("about_title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: bio + fun facts */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-8"
          >
            <p className="font-body text-text-secondary leading-relaxed text-base md:text-lg">
              {lang === "en" && data.bioEn ? data.bioEn : data.bio}
            </p>

            <div>
              <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-4">
                {t("about_funfacts")}
              </p>
              <ul className="space-y-3">
                {data.funFacts.map((fact, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <Gamepad2
                      size={14}
                      className="text-accent-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
                    />
                    <span className="font-body text-sm text-text-secondary glitch-text group-hover:text-text-primary transition-colors" data-text={fact}>
                      {lang === "en" && data.funFactsEn?.[i] ? data.funFactsEn[i] : fact}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-6 py-3 border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary transition-all duration-300"
              style={{ boxShadow: "0 0 12px rgba(232,255,71,0.1)" }}
            >
              <Download size={14} />
              {t("download_cv")}
            </a>
          </motion.div>

          {/* Right: photo + info card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="space-y-6"
          >
            {/* Photo placeholder */}
            <div className="relative w-32 h-32 mx-auto md:mx-0">
              <div
                className="w-full h-full rounded-sm bg-bg-tertiary border border-[rgba(240,246,252,0.08)] flex items-center justify-center overflow-hidden"
                style={{ boxShadow: "0 0 30px rgba(232,255,71,0.08)" }}
              >
                <span
                  className="font-display text-5xl text-accent-primary select-none"
                  style={{ textShadow: "0 0 20px rgba(232,255,71,0.4)" }}
                >
                  EV
                </span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-bg-primary border-2 border-bg-primary flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse-glow" />
              </div>
            </div>

            <div
              className="rounded-sm bg-bg-secondary border border-[rgba(240,246,252,0.08)] p-6 md:p-8 space-y-5"
              style={{ boxShadow: "inset 0 0 40px rgba(0,229,255,0.02)" }}
            >
              <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-6">
                {t("about_profile")}
              </p>

              {Object.entries(data.details).map(([key, value], i) => {
                const Icon = detailIcons[key as keyof typeof detailIcons];
                const labelKey = detailLabelKeys[key];
                const label = labelKey ? t(labelKey) : key;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-start gap-4 pb-5 border-b border-[rgba(240,246,252,0.06)] last:border-0 last:pb-0"
                  >
                    {Icon && (
                      <div className="mt-0.5 w-7 h-7 flex items-center justify-center rounded bg-bg-tertiary border border-[rgba(240,246,252,0.06)] shrink-0">
                        <Icon size={13} className="text-accent-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-[10px] text-text-muted tracking-widest uppercase mb-1">
                        {label}
                      </p>
                      <p className="font-body text-sm text-text-primary">{value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
