"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/lib/sections";
import NeonBadge from "./NeonBadge";
import { getTagClass } from "@/lib/sections";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  featured?: boolean;
  dimmed?: boolean;
}

const statusConfig = {
  "Terminé": { variant: "primary" as const, pulse: false },
  "En cours": { variant: "secondary" as const, pulse: true },
  "Prototype": { variant: "muted" as const, pulse: false },
};

export default function ProjectCard({ project, onOpen, featured = false, dimmed = false }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const status = statusConfig[project.status] || statusConfig["Prototype"];

  if (featured) {
    return (
      <motion.div
        layout
        animate={{ opacity: dimmed ? 0.3 : 1, scale: dimmed ? 0.98 : 1 }}
        transition={{ duration: 0.3 }}
        className="group cursor-image col-span-full grid md:grid-cols-2 gap-0 rounded-sm overflow-hidden border border-[rgba(240,246,252,0.08)] hover:border-accent-primary/40 bg-bg-secondary transition-colors duration-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onOpen(project)}
      >
        {/* Image */}
        <div className="relative h-64 md:h-auto overflow-hidden bg-bg-tertiary">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-secondary z-10 hidden md:block" />
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
            style={{
              backgroundImage: `url(${project.image})`,
              transform: hovered ? "scale(1.05)" : "scale(1)",
              backgroundColor: "var(--bg-tertiary)",
            }}
          />
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-glow/5" />
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <NeonBadge variant={status.variant} pulse={status.pulse}>{project.status}</NeonBadge>
            <span className="font-mono text-xs text-text-muted">{project.engine} · {project.year}</span>
          </div>
          <h3 className="font-display text-4xl text-text-primary mb-2">{project.title}</h3>
          <p className="font-mono text-xs text-accent-glow mb-4 tracking-wider">{project.type}</p>
          <p className="font-body text-sm text-text-secondary leading-relaxed mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${getTagClass(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
          <motion.button
            className="self-start font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary transition-all duration-200"
            style={{ boxShadow: hovered ? "0 0 20px rgba(232,255,71,0.3)" : "none" }}
          >
            VOIR LE PROJET →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      animate={{ opacity: dimmed ? 0.3 : 1, scale: dimmed ? 0.95 : 1 }}
      transition={{ duration: 0.3 }}
      className="group cursor-image rounded-sm overflow-hidden border border-[rgba(240,246,252,0.08)] hover:border-accent-primary/40 bg-bg-secondary transition-all duration-300 hover:-translate-y-1 flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-bg-tertiary flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url(${project.image})`,
            backgroundColor: "var(--bg-tertiary)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-glow/5" />
        {/* Bottom gradient with title */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-secondary to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <NeonBadge variant={status.variant} pulse={status.pulse}>{project.status}</NeonBadge>
        </div>

        {/* Hover CTA */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-mono text-xs tracking-widest text-accent-primary border border-accent-primary px-4 py-2">
            VOIR LE PROJET
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-2xl text-text-primary">{project.title}</h3>
          <span className="font-mono text-[10px] text-text-muted shrink-0 mt-1">{project.year}</span>
        </div>
        <p className="font-mono text-xs text-accent-glow mb-3">{project.engine} · {project.type}</p>
        <p className="font-body text-sm text-text-secondary leading-relaxed mb-4 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${getTagClass(tag)}`}>
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-[10px] font-mono px-2 py-0.5 text-text-muted">+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
