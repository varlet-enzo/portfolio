"use client";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HeroData, HeroStat } from "@/lib/sections";
import NeonBadge from "@/components/ui/NeonBadge";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

// ── Particle field ─────────────────────────────────────────────────────────────
function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const COUNT = 1800;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = 0;
    }
    return [pos, vel];
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) s[i] = Math.random() * 2 + 0.5;
    return s;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;

    const mx = mouse.current.x * 10;
    const my = mouse.current.y * 10;
    const REPULSE_RADIUS = 2.5;
    const REPULSE_FORCE = 0.03;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const dx = pos[ix] - mx;
      const dy = pos[ix + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPULSE_RADIUS && dist > 0) {
        const force = (REPULSE_RADIUS - dist) / REPULSE_RADIUS * REPULSE_FORCE;
        velocities[ix] += (dx / dist) * force;
        velocities[ix + 1] += (dy / dist) * force;
      }

      velocities[ix] *= 0.98;
      velocities[ix + 1] *= 0.98;

      pos[ix] += velocities[ix] + (Math.random() - 0.5) * 0.001;
      pos[ix + 1] += velocities[ix + 1] + (Math.random() - 0.5) * 0.001;

      // Wrap
      if (pos[ix] > 10) pos[ix] = -10;
      if (pos[ix] < -10) pos[ix] = 10;
      if (pos[ix + 1] > 10) pos[ix + 1] = -10;
      if (pos[ix + 1] < -10) pos[ix + 1] = 10;
    }

    geo.attributes.position.needsUpdate = true;
    meshRef.current.rotation.z += delta * 0.01;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00E5FF"
        size={0.04}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Typewriter + role rotator ─────────────────────────────────────────────────
function TypewriterRoles({ roles }: { roles: string[] }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = roles[roleIdx];
    let timeout: NodeJS.Timeout;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx, roles]);

  return (
    <span className="font-mono text-sm md:text-base text-accent-glow tracking-widest">
      {displayed}
      <span className="animate-blink">|</span>
    </span>
  );
}

// ── Magnetic button ───────────────────────────────────────────────────────────
function MagneticButton({ label, onClick }: { label: string; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      setOffset({ x: dx * 0.3, y: dy * 0.3 });
    }
  }, []);

  const handleLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return (
    <motion.button
      ref={ref}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className="group font-mono text-xs tracking-widest uppercase px-8 py-4 border border-accent-primary text-accent-primary transition-all duration-300 hover:bg-accent-primary hover:text-bg-primary relative overflow-hidden"
      style={{ boxShadow: "0 0 0 rgba(232,255,71,0)" }}
      whileHover={{ boxShadow: "0 0 30px rgba(232,255,71,0.4)" }}
    >
      {label} →
    </motion.button>
  );
}

// ── Hero section ──────────────────────────────────────────────────────────────
interface HeroSectionProps {
  data: HeroData;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const [scrolled, setScrolled] = useState(false);
  const { t, lang } = useTranslation();
  const displayTagline = lang === "en" && data.taglineEn ? data.taglineEn : data.tagline;
  const displayCtaLabel = lang === "en" && data.ctaLabelEn ? data.ctaLabelEn : data.ctaLabel;
  const displayAvailableFor = lang === "en" && data.availableForEn ? data.availableForEn : data.availableFor;
  const displayStats = lang === "en" && data.statsEn ? data.statsEn : data.stats;
  const displayRoles = lang === "en" && data.rolesEn ? data.rolesEn : data.roles;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToProjects = () => {
    const el = document.getElementById(data.ctaTarget);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const nameLetters = data.name.split("");
  const surnameLetters = data.surname.split("");

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* Three.js background (desktop only) */}
      {!isMobile && (
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]}>
            <Particles />
          </Canvas>
        </div>
      )}

      {/* Gradient CSS background (always present, fallback on mobile) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(232,255,71,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <NeonBadge variant="primary" dot pulse>
            {displayAvailableFor}
          </NeonBadge>
        </motion.div>

        {/* Name */}
        <div className="mb-4">
          {/* First name */}
          <div className="flex flex-wrap overflow-hidden">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={`name-${i}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.03, ease: "easeOut", duration: 0.5 }}
                className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-none text-text-primary"
              >
                {letter === " " ? " " : letter}
              </motion.span>
            ))}
          </div>

          {/* Surname with glow */}
          <div className="flex flex-wrap overflow-hidden">
            {surnameLetters.map((letter, i) => (
              <motion.span
                key={`surname-${i}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.03, ease: "easeOut", duration: 0.5 }}
                className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-none text-accent-primary text-glow-primary"
              >
                {letter === " " ? " " : letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Tagline + roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-3 mb-12"
        >
          <p className="font-mono text-sm text-text-muted tracking-widest uppercase">
            {displayTagline}
          </p>
          <TypewriterRoles roles={displayRoles} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <MagneticButton label={displayCtaLabel} onClick={scrollToProjects} />
        </motion.div>

        {/* Stats strip */}
        {displayStats && displayStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-16 pt-8 border-t border-[rgba(240,246,252,0.06)] grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0"
          >
            {displayStats.map((stat: HeroStat, i: number) => (
              <div
                key={i}
                className={`flex flex-col gap-1 ${i > 0 ? "md:border-l md:border-[rgba(240,246,252,0.06)] md:pl-8" : ""}`}
              >
                <span
                  className="font-display text-3xl md:text-4xl text-accent-primary"
                  style={{ textShadow: "0 0 20px rgba(232,255,71,0.3)" }}
                >
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {!scrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] text-text-muted tracking-widest">{t("scroll")}</span>
          <ChevronDown
            size={16}
            className="text-text-muted animate-bounce-gentle"
          />
        </motion.div>
      )}
    </section>
  );
}
