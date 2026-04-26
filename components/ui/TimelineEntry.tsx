"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TimelineEntry as TEntry } from "@/lib/sections";
import NeonBadge from "./NeonBadge";

interface TimelineEntryProps {
  entry: TEntry;
  index: number;
  isLeft: boolean;
}

const typeConfig = {
  formation: { label: "Formation", variant: "cyan" as const },
  projet: { label: "Projet", variant: "primary" as const },
  experience: { label: "Expérience", variant: "secondary" as const },
  recompense: { label: "Récompense", variant: "primary" as const },
};

const tagColors: Record<string, string> = {
  Unity: "tag-unity",
  "UE5": "tag-unreal",
  "Unreal Engine 5": "tag-unreal",
  Godot: "tag-godot",
};

function getTagClass(tag: string) {
  return tagColors[tag] || "tag-default";
}

export default function TimelineEntryComponent({ entry, index, isLeft }: TimelineEntryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const config = typeConfig[entry.type] || typeConfig.projet;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-8 ${isLeft ? "flex-row-reverse md:pr-1/2" : "md:pl-1/2"} md:w-1/2 ${isLeft ? "md:ml-auto" : ""}`}
    >
      {/* Connector dot */}
      <div
        className={`absolute top-6 hidden md:block w-3 h-3 rounded-full border-2 border-accent-primary bg-bg-primary z-10 ${
          isLeft ? "-left-[7px]" : "-right-[7px]"
        }`}
        style={{ boxShadow: "0 0 8px rgba(232,255,71,0.5)" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        className="flex-1 p-5 rounded-sm bg-bg-secondary border border-[rgba(240,246,252,0.08)] hover:border-accent-primary/30 transition-colors duration-300"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className="font-display text-3xl text-accent-primary leading-none">
            {entry.year}
          </span>
          <NeonBadge variant={config.variant}>{config.label}</NeonBadge>
        </div>
        <h3 className="font-body font-semibold text-text-primary mb-1">{entry.title}</h3>
        <p className="font-mono text-xs text-text-muted mb-3">{entry.organization}</p>
        <p className="font-body text-sm text-text-secondary leading-relaxed mb-4">
          {entry.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${getTagClass(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
