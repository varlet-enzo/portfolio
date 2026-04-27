"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollTop}
          aria-label="Retour en haut"
          className="fixed bottom-8 right-6 z-[9980] w-10 h-10 flex items-center justify-center border border-accent-primary text-accent-primary bg-bg-primary/80 backdrop-blur-sm transition-all duration-300 hover:bg-accent-primary hover:text-bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          style={{ boxShadow: "0 0 20px rgba(232,255,71,0.2)" }}
          whileHover={{ boxShadow: "0 0 30px rgba(232,255,71,0.5)" }}
        >
          <ChevronUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
