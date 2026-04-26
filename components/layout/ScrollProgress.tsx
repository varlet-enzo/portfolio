"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const spring = useSpring(0, { stiffness: 300, damping: 40 });

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
      spring.set(pct);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [spring]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9997] h-[2px] bg-bg-secondary pointer-events-none">
      <motion.div
        className="h-full"
        style={{
          width: spring.get() + "%",
          background: "linear-gradient(90deg, #E8FF47, #FF3F5B)",
          boxShadow: "0 0 8px rgba(232,255,71,0.5)",
          scaleX: spring,
        }}
        animate={{ width: progress + "%" }}
        transition={{ duration: 0 }}
      />
    </div>
  );
}
