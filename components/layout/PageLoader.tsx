"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "> Initializing portfolio...",
  "> Loading assets...",
  "> Calibrating systems...",
  "> Press START",
];

export default function PageLoader() {
  const [show, setShow] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("portfolio-loaded")) return;
    setShow(true);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setLineIndex(idx);
      if (idx >= LINES.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          sessionStorage.setItem("portfolio-loaded", "1");
        }, 500);
      }
    }, 380);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
          className="fixed inset-0 z-[99998] bg-bg-primary flex flex-col items-center justify-center gap-2"
        >
          {/* Progress bar */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] bg-accent-primary"
            initial={{ width: "0%" }}
            animate={{ width: done ? "100%" : `${((lineIndex + 1) / LINES.length) * 100}%` }}
            transition={{ duration: 0.35, ease: "linear" }}
            style={{ boxShadow: "0 0 10px rgba(232,255,71,0.5)" }}
          />

          <div className="font-mono text-sm space-y-2 w-72">
            {LINES.slice(0, lineIndex + 1).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`${i === lineIndex ? "text-accent-primary" : "text-text-muted"} ${
                  i === LINES.length - 1 && i === lineIndex ? "animate-blink" : ""
                }`}
              >
                {line}
                {i === lineIndex && i < LINES.length - 1 && (
                  <span className="animate-blink">█</span>
                )}
              </motion.p>
            ))}
          </div>

          <p className="absolute bottom-8 font-mono text-xs text-text-muted tracking-widest">
            ENZO VARLET · GAME DEVELOPER
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
