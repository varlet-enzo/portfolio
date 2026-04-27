"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ProjectsData, Project } from "@/lib/sections";
import ProjectCard from "@/components/ui/ProjectCard";
import NeonBadge from "@/components/ui/NeonBadge";
import { X, GitBranch, ExternalLink, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { getTagClass } from "@/lib/sections";
import { useTranslation, translateTag } from "@/lib/i18n";

interface ProjectsSectionProps {
  data: ProjectsData;
}

function toYouTubeEmbed(url: string): string | null {
  try {
    if (url.includes("youtube.com/watch")) {
      const v = new URL(url).searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {}
  return null;
}

function ModalImage({ src, onClick }: { src: string; onClick?: () => void }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center"><span className="font-mono text-[10px] text-text-muted">IMG</span></div>;
  }
  return (
    <img
      src={src}
      alt=""
      loading="eager"
      decoding="async"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${onClick ? "cursor-zoom-in" : "cursor-image"}`}
      onClick={onClick}
      onError={() => setErrored(true)}
    />
  );
}

function Lightbox({
  images,
  startIdx,
  onClose,
}: {
  images: string[];
  startIdx: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIdx);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Image */}
      <motion.img
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={images[idx]}
        alt=""
        className="max-w-[90vw] max-h-[90vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition-colors rounded-sm"
      >
        <X size={16} />
      </button>

      {/* Nav */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Précédent"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Suivant"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/60 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40">
            {idx + 1} / {images.length}
          </div>
        </>
      )}
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t, lang } = useTranslation();

  const allScreenshots = project.screenshots?.length
    ? project.screenshots
    : [project.image];

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.activeElement as HTMLElement | null;
    return () => prev?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setImgIdx((i) => (i - 1 + allScreenshots.length) % allScreenshots.length);
      if (e.key === "ArrowRight") setImgIdx((i) => (i + 1) % allScreenshots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, allScreenshots.length, lightboxOpen]);

  const statusConfig = {
    "Terminé": "primary" as const,
    "En cours": "secondary" as const,
    "Prototype": "muted" as const,
  };

  return (
    <motion.div
      key="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9980] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-md" />
      <motion.div
        key="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-bg-secondary border border-[rgba(240,246,252,0.12)] rounded-sm"
      >
        {/* Close */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center border border-[rgba(240,246,252,0.12)] text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          <X size={14} />
        </button>

        {/* Screenshot gallery */}
        <div className="relative h-56 md:h-72 bg-bg-tertiary overflow-hidden">
          <ModalImage src={allScreenshots[imgIdx]} onClick={() => setLightboxOpen(true)} />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-glow/5 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/80 to-transparent pointer-events-none" />

          {allScreenshots.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx((i) => (i - 1 + allScreenshots.length) % allScreenshots.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-bg-primary/60 border border-[rgba(240,246,252,0.12)] text-text-secondary hover:text-accent-primary transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % allScreenshots.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-bg-primary/60 border border-[rgba(240,246,252,0.12)] text-text-secondary hover:text-accent-primary transition-colors"
              >
                <ChevronRight size={14} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allScreenshots.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-accent-primary w-4" : "bg-text-muted"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-4 flex-wrap">
            <div className="flex-1">
              <h2 className="font-display text-3xl md:text-4xl text-text-primary mb-1">
                {project.title}
              </h2>
              <p className="font-mono text-xs text-accent-glow tracking-wider">
                {project.engine} · {project.type} · {project.year}
                {project.duration && (
                  <> · <span className="text-text-muted">{t("projects_duration")} : {lang === "en" && project.durationEn ? project.durationEn : project.duration}</span></>
                )}
              </p>
            </div>
            <NeonBadge variant={statusConfig[project.status] || "muted"}>
              {project.status}
            </NeonBadge>
          </div>

          <p className="font-body text-text-secondary leading-relaxed mb-6">
            {lang === "en" && project.longDescriptionEn ? project.longDescriptionEn : project.longDescription}
          </p>

          {/* Video embed */}
          {project.video && (() => {
            const embedUrl = toYouTubeEmbed(project.video);
            return (
              <div className="mb-6">
                <p className="flex items-center gap-2 font-mono text-[10px] text-text-muted tracking-widest uppercase mb-3">
                  <Play size={10} className="text-accent-primary" />
                  {t("projects_video")}
                </p>
                <div className="aspect-video bg-bg-tertiary border border-[rgba(240,246,252,0.08)] overflow-hidden rounded-sm">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${project.title} — vidéo`}
                    />
                  ) : (
                    <video
                      src={project.video}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            );
          })()}

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className={`text-[10px] font-mono px-2 py-1 rounded-sm border ${getTagClass(tag)}`}>
                {translateTag(tag, lang)}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 border border-[rgba(240,246,252,0.12)] text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all duration-200"
              >
                <GitBranch size={12} />
                GitHub
              </a>
            )}
            {project.links.itch && (
              <a
                href={project.links.itch}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 border border-[rgba(240,246,252,0.12)] text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all duration-200"
              >
                <ExternalLink size={12} />
                Itch.io
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 bg-accent-primary text-bg-primary hover:bg-accent-primary/80 transition-all duration-200"
              >
                <ExternalLink size={12} />
                Démo live
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={allScreenshots}
            startIdx={imgIdx}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const { t, lang } = useTranslation();

  const allTags = Array.from(
    new Set(data.items.flatMap((p) => p.tags))
  ).slice(0, 8);

  const featuredProject = data.featured ? data.items.find((p) => p.highlight) : null;
  const otherProjects = data.items.filter((p) => !p.highlight || !data.featured);

  const isDimmed = (project: Project) => {
    if (!activeTag) return false;
    return !project.tags.includes(activeTag);
  };

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">{t("projects_label")}</p>
          <h2 className="font-display text-5xl md:text-7xl text-text-primary mb-10">
            {t("projects_title")}
          </h2>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all duration-200 ${
                !activeTag
                  ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                  : "border-[rgba(240,246,252,0.12)] text-text-muted hover:border-text-secondary hover:text-text-secondary"
              }`}
            >
              {t("projects_all")}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  activeTag === tag
                    ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                    : "border-[rgba(240,246,252,0.12)] text-text-muted hover:border-text-secondary hover:text-text-secondary"
                }`}
              >
                {translateTag(tag, lang)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          layout
          className="space-y-6"
        >
          {/* Featured project */}
          {featuredProject && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProjectCard
                project={featuredProject}
                onOpen={setModalProject}
                featured
                dimmed={isDimmed(featuredProject)}
              />
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              >
                <ProjectCard
                  project={project}
                  onOpen={setModalProject}
                  dimmed={isDimmed(project)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalProject && (
          <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
