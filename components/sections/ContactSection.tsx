"use client";
import { useRef, useState } from "react";
import type { ElementType } from "react";
import { motion, useInView } from "framer-motion";
import { ContactData } from "@/lib/sections";
import { Link2, GitBranch, ExternalLink, Mail, Download, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ContactSectionProps {
  data: ContactData;
}

const links = [
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    Icon: Link2,
    color: "#0A66C2",
  },
  {
    key: "github" as const,
    label: "GitHub",
    Icon: GitBranch,
    color: "#F0F6FC",
  },
  {
    key: "itch" as const,
    label: "Itch.io",
    Icon: ExternalLink,
    color: "#FA5C5C",
  },
];

function SocialCard({
  href, label, Icon, color, delay, inView,
}: {
  href: string;
  label: string;
  Icon: ElementType;
  color: string;
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — ouvre dans un nouvel onglet`}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-between p-5 rounded-sm bg-bg-secondary border transition-all duration-300"
      style={{
        borderColor: hovered ? `${color}60` : "rgba(240,246,252,0.08)",
        boxShadow: hovered ? `0 0 20px ${color}18` : "none",
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 flex items-center justify-center rounded bg-bg-tertiary border border-[rgba(240,246,252,0.06)]">
          <Icon size={16} style={{ color: hovered ? color : "var(--text-secondary)", transition: "color 0.3s" }} />
        </div>
        <span className="font-body text-sm text-text-primary">{label}</span>
      </div>
      <ArrowRight
        size={14}
        style={{
          color: hovered ? color : "var(--text-muted)",
          transform: hovered ? "translateX(6px)" : "translateX(0)",
          transition: "color 0.3s, transform 0.3s",
        }}
      />
    </motion.a>
  );
}

export default function ContactSection({ data }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t, lang } = useTranslation();

  const mailtoHref = `mailto:${data.email}?subject=${encodeURIComponent(t("contact_subject"))}`;
  const displayMessage = lang === "en" && data.messageEn ? data.messageEn : data.message;

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(232,255,71,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">{t("contact_label")}</p>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary">
            {t("contact_title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-8"
          >
            <p className="font-body text-text-secondary leading-relaxed text-base md:text-lg">
              {displayMessage}
            </p>

            <a
              href={mailtoHref}
              className="inline-flex items-center gap-3 font-display text-3xl md:text-4xl text-text-primary hover:text-accent-primary transition-colors duration-300 group"
            >
              <Mail size={24} className="shrink-0" />
              <span>{data.email}</span>
              <ArrowRight
                size={20}
                className="translate-x-0 group-hover:translate-x-2 transition-transform duration-300 text-accent-primary"
              />
            </a>

            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-8 py-4 bg-accent-primary text-bg-primary hover:bg-accent-primary/80 transition-all duration-300 font-bold"
              style={{ boxShadow: "0 0 30px rgba(232,255,71,0.3)" }}
            >
              <Download size={14} />
              {t("download_cv")}
            </a>
          </motion.div>

          {/* Right: social links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="space-y-4"
          >
            <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-6">
              {t("contact_social")}
            </p>

            {links.map(({ key, label, Icon, color }, i) => {
              const href = data[key];
              if (!href) return null;
              return (
                <SocialCard
                  key={key}
                  href={href}
                  label={label}
                  Icon={Icon}
                  color={color}
                  delay={0.35 + i * 0.1}
                  inView={inView}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-24 pt-8 border-t border-[rgba(240,246,252,0.06)] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="font-mono text-xs text-text-muted">
            © {new Date().getFullYear()} Enzo Varlet · {t("footer_built")}
          </p>
          <p className="font-mono text-xs text-text-muted">
            ↑↑↓↓←→←→BA
          </p>
        </motion.div>
      </div>
    </section>
  );
}
