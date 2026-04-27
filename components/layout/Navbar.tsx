"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/lib/sections";
import { Menu, X, Download } from "lucide-react";

interface NavbarProps {
  sections: Section[];
}

export default function Navbar({ sections }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const lastScrollY = useRef(0);

  const navSections = useMemo(
    () => sections.filter((s) => s.visible).sort((a, b) => a.order - b.order),
    [sections]
  );

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastScrollY.current && y > 100);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracker via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(s.id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [navSections]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-300 ${
          scrolled ? "backdrop-blur-md bg-bg-primary/80 border-b border-[rgba(240,246,252,0.08)]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="font-display text-2xl text-accent-primary glitch-text"
            data-text="EV"
            style={{ textShadow: "0 0 15px rgba(232,255,71,0.4)" }}
          >
            EV
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="relative font-mono text-xs tracking-widest uppercase transition-colors duration-200 group"
                style={{ color: activeId === s.id ? "var(--accent-primary)" : "var(--text-secondary)" }}
              >
                {s.title}
                <span
                  className="absolute -bottom-1 left-0 h-[1px] bg-accent-primary transition-all duration-300 origin-left"
                  style={{ width: activeId === s.id ? "100%" : "0%" }}
                />
                <span className="absolute -bottom-1 left-0 h-[1px] bg-accent-primary/40 w-0 group-hover:w-full transition-all duration-300 origin-left" />
              </button>
            ))}
          </div>

          {/* CV button + hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="/cv.pdf"
              download
              className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-accent-primary text-accent-primary transition-all duration-300 hover:bg-accent-primary hover:text-bg-primary"
              style={{ boxShadow: "0 0 12px rgba(232,255,71,0.15)" }}
            >
              <Download size={12} />
              CV
            </a>
            <button
              className="md:hidden text-text-secondary hover:text-accent-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9989] bg-bg-primary/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navSections.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(s.id)}
                className="font-display text-4xl tracking-widest text-text-primary hover:text-accent-primary transition-colors"
              >
                {s.title.toUpperCase()}
              </motion.button>
            ))}
            <a
              href="/cv.pdf"
              download
              className="flex items-center gap-2 font-mono text-sm tracking-widest uppercase px-6 py-3 rounded-full border border-accent-primary text-accent-primary mt-4"
            >
              <Download size={14} />
              Télécharger CV
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
