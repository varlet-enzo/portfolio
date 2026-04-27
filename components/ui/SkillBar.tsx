"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SkillItem } from "@/lib/sections";

interface SkillBarProps {
  skill: SkillItem;
  delay?: number;
}

function getLevelConfig(level: number) {
  if (level >= 80) return { label: "Expert", color: "#E8FF47", glow: "rgba(232,255,71,0.5)" };
  if (level >= 65) return { label: "Avancé", color: "#00E5FF", glow: "rgba(0,229,255,0.5)" };
  if (level >= 45) return { label: "Intermédiaire", color: "#8B949E", glow: "rgba(139,148,158,0.3)" };
  return { label: "Notions", color: "#484F58", glow: "none" };
}

export default function SkillBar({ skill, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView && !animated) setAnimated(true);
  }, [inView, animated]);

  const { label, color, glow } = getLevelConfig(skill.level);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary border leading-none"
            style={{ color, borderColor: `${color}33` }}
          >
            {skill.icon}
          </span>
          <span className="font-body text-sm text-text-primary">{skill.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[9px] tracking-wider uppercase hidden sm:block"
            style={{ color, opacity: 0.7 }}
          >
            {label}
          </span>
          <span className="font-mono text-xs text-text-muted">{skill.level}%</span>
        </div>
      </div>

      <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: animated ? `${skill.level}%` : 0 }}
          transition={{ duration: skill.level / 100, delay, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (animated && ref.current) {
              const bar = ref.current.querySelector(".h-full") as HTMLElement;
              if (bar) bar.style.boxShadow = `0 0 8px ${glow}`;
            }
          }}
        />
      </div>
    </div>
  );
}
