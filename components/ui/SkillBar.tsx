"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SkillItem } from "@/lib/sections";

interface SkillBarProps {
  skill: SkillItem;
  delay?: number;
}

export default function SkillBar({ skill, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView && !animated) setAnimated(true);
  }, [inView, animated]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Abbreviated icon badge */}
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-accent-primary border border-accent-primary/20 leading-none">
            {skill.icon}
          </span>
          <span className="font-body text-sm text-text-primary">{skill.name}</span>
        </div>
        <span className="font-mono text-xs text-text-muted">{skill.level}%</span>
      </div>

      {/* Bar */}
      <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent-primary"
          initial={{ width: 0 }}
          animate={{ width: animated ? `${skill.level}%` : 0 }}
          transition={{ duration: skill.level / 100, delay, ease: "easeOut" }}
          style={{
            boxShadow: animated ? "0 0 8px rgba(232,255,71,0.4)" : "none",
          }}
        />
      </div>
    </div>
  );
}
