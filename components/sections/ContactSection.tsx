"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ContactData } from "@/lib/sections";
import { Link2, GitBranch, ExternalLink, Mail, Download, ArrowRight } from "lucide-react";

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

export default function ContactSection({ data }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const mailtoHref = `mailto:${data.email}?subject=Opportunit%C3%A9%20alternance`;

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
          <p className="section-label mb-3">05 — CONTACT</p>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary">
            TRAVAILLONS ENSEMBLE
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
              {data.message}
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
              Télécharger mon CV
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
              {"// Retrouvez-moi sur"}
            </p>

            {links.map(({ key, label, Icon }, i) => {
              const href = data[key];
              if (!href) return null;
              return (
                <motion.a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  className="flex items-center justify-between p-5 rounded-sm bg-bg-secondary border border-[rgba(240,246,252,0.08)] hover:border-accent-primary/40 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 flex items-center justify-center rounded bg-bg-tertiary border border-[rgba(240,246,252,0.06)]">
                      <Icon size={16} className="text-text-secondary group-hover:text-accent-primary transition-colors" />
                    </div>
                    <span className="font-body text-sm text-text-primary">{label}</span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-text-muted translate-x-0 group-hover:translate-x-2 group-hover:text-accent-primary transition-all duration-300"
                  />
                </motion.a>
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
            © 2024 Enzo Varlet · Built with Next.js + Three.js
          </p>
          <p className="font-mono text-xs text-text-muted">
            ↑↑↓↓←→←→BA
          </p>
        </motion.div>
      </div>
    </section>
  );
}
