"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

function playCheatSound() {
  try {
    const AudioCtx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new AudioCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "square";
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.08);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.1);
    });
  } catch {
    // Audio not available
  }
}

export default function KonamiCode() {
  const [active, setActive] = useState(false);

  const bufRef = useRef<string[]>([]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    bufRef.current = [...bufRef.current, e.key].slice(-SEQUENCE.length);
    if (bufRef.current.join(",") === SEQUENCE.join(",")) {
      setActive(true);
      playCheatSound();
      document.documentElement.classList.add("pixelate-mode");
      setTimeout(() => {
        setActive(false);
        document.documentElement.classList.remove("pixelate-mode");
      }, 10000);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <>
      <style>{`
        .pixelate-mode * {
          image-rendering: pixelated !important;
        }
        .pixelate-mode {
          filter: contrast(1.3) saturate(2) brightness(0.9);
        }
      `}</style>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[99990] pointer-events-none"
          >
            <div
              className="font-mono text-sm tracking-widest uppercase px-6 py-3 border-2 border-accent-primary text-accent-primary bg-bg-primary/90"
              style={{ boxShadow: "0 0 30px rgba(232,255,71,0.6), inset 0 0 30px rgba(232,255,71,0.05)" }}
            >
              ★ CHEAT CODE ACTIVATED ★
            </div>
            <div className="text-center font-mono text-xs text-text-muted mt-2 tracking-wider">
              8-BIT MODE — 10s
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
