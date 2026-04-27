"use client";
import { useState, useEffect } from "react";
import { Project, ProjectsData } from "@/lib/sections";
import { Plus, Edit2, Trash2, ChevronLeft, Star, X } from "lucide-react";

// ── Video embed helper ───────────────────────────────────────────────────────────
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

function VideoEmbed({ url }: { url: string }) {
  const embedUrl = toYouTubeEmbed(url);
  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Aperçu vidéo"
      />
    );
  }
  return (
    <video src={url} controls className="w-full h-full object-contain bg-black">
      Votre navigateur ne supporte pas la vidéo.
    </video>
  );
}

// ── Shared style ────────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-bg-tertiary border border-[rgba(240,246,252,0.08)] text-text-primary font-body text-sm px-3 py-2 outline-none focus:border-accent-primary transition-colors";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[10px] text-text-muted tracking-widest uppercase block">
        {label}
        {required && <span className="text-accent-secondary ml-1">*</span>}
      </label>
      {hint && <p className="font-body text-[11px] text-text-muted">{hint}</p>}
      {children}
    </div>
  );
}

// ── Tag input ───────────────────────────────────────────────────────────────────
function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 bg-bg-tertiary border border-accent-primary/20 text-accent-primary"
          >
            {tag}
            <button
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="hover:text-accent-secondary transition-colors"
              aria-label={`Supprimer ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder='Unity, C#, 2D… (Entrée pour valider)'
          className={inputCls}
        />
        <button
          onClick={add}
          className="px-3 border border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10 transition-colors font-mono text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── Screenshot URLs list ─────────────────────────────────────────────────────────
function ScreenshotsInput({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (u: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {urls.map((url, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={url}
            onChange={(e) => {
              const next = [...urls];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder="/projects/screenshot.jpg  ou  https://..."
            className={inputCls + " font-mono text-xs"}
          />
          <button
            onClick={() => onChange(urls.filter((_, j) => j !== i))}
            className="px-2 border border-[rgba(240,246,252,0.08)] text-text-muted hover:text-accent-secondary hover:border-accent-secondary transition-colors"
            aria-label="Supprimer"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...urls, ""])}
        className="font-mono text-xs text-text-muted hover:text-accent-primary transition-colors"
      >
        + Ajouter un screenshot
      </button>
    </div>
  );
}

// ── Toggle switch ────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-accent-primary" : "bg-bg-tertiary border border-[rgba(240,246,252,0.12)]"}`}
      >
        <div
          className="absolute top-[3px] w-3.5 h-3.5 rounded-full transition-transform"
          style={{
            background: checked ? "#080B10" : "#484F58",
            transform: checked ? "translateX(22px)" : "translateX(3px)",
          }}
        />
      </div>
      <span className="font-mono text-xs text-text-muted">{label}</span>
    </label>
  );
}

// ── Project form ─────────────────────────────────────────────────────────────────
const ENGINES = ["Unity", "Unreal Engine 5", "Godot", "GameMaker", "Custom Engine", "Autre"];
const STATUSES = ["Terminé", "En cours", "Prototype"] as const;

function emptyProject(): Project {
  return {
    id: `proj-${Date.now()}`,
    title: "",
    type: "",
    engine: "Unity",
    year: new Date().getFullYear().toString(),
    status: "En cours",
    description: "",
    longDescription: "",
    tags: [],
    image: "",
    screenshots: [],
    links: { github: "", itch: "", demo: "" },
    highlight: false,
  };
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Project>({ ...project });
  const [previewUrl, setPreviewUrl] = useState(project.image ?? "");
  const [videoPreview, setVideoPreview] = useState(project.video ?? "");

  useEffect(() => {
    const t = setTimeout(() => setPreviewUrl(form.image ?? ""), 500);
    return () => clearTimeout(t);
  }, [form.image]);

  useEffect(() => {
    const t = setTimeout(() => setVideoPreview(form.video ?? ""), 700);
    return () => clearTimeout(t);
  }, [form.video]);

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setLink = (key: keyof NonNullable<Project["links"]>, value: string) =>
    setForm((f) => ({ ...f, links: { ...f.links, [key]: value } }));

  const canSave = form.title.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[rgba(240,246,252,0.06)]">
        <button
          onClick={onCancel}
          className="text-text-muted hover:text-accent-primary transition-colors"
          aria-label="Retour"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="font-display text-xl text-text-primary">
          {form.title || "Nouveau projet"}
        </h3>
      </div>

      {/* Grid row 1 */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Titre" required>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex: Abyss Protocol"
            className={inputCls}
            autoFocus
          />
        </Field>
        <Field label="Type de jeu">
          <input
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            placeholder="Ex: Roguelike 2D, FPS, Puzzle…"
            className={inputCls}
          />
        </Field>
        <Field label="Moteur">
          <select
            value={form.engine}
            onChange={(e) => set("engine", e.target.value)}
            className={inputCls}
          >
            {ENGINES.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </Field>
        <Field label="Année">
          <input
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            placeholder="2024"
            className={inputCls}
          />
        </Field>
        <Field label="Statut">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as Project["status"])}
            className={inputCls}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Mise en avant">
          <div className="mt-2">
            <Toggle
              checked={form.highlight ?? false}
              onChange={(v) => set("highlight", v)}
              label={form.highlight ? "Affiché pleine largeur" : "Grille normale"}
            />
          </div>
        </Field>
      </div>

      {/* Descriptions */}
      <Field label="Description courte" hint="Visible sur la carte projet (1-2 phrases max)">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={2}
          placeholder="Description courte pour la carte…"
          className={inputCls + " resize-none"}
        />
      </Field>

      <Field
        label="Description complète"
        hint="Affichée dans le modal — raconte le projet, les défis techniques, ce que tu as appris"
      >
        <textarea
          value={form.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
          rows={6}
          placeholder="Contexte, mécanique principale, défis rencontrés, apprentissages…"
          className={inputCls + " resize-none"}
        />
      </Field>

      {/* Tags */}
      <Field label="Outils & Technologies" hint="Appuie sur Entrée ou virgule pour ajouter">
        <TagInput tags={form.tags} onChange={(t) => set("tags", t)} />
      </Field>

      {/* Cover image */}
      <Field
        label="Image principale"
        hint="Colle un lien (https://…) ou un chemin local (/projects/cover.jpg)"
      >
        <input
          value={form.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="https://  ou  /projects/cover.jpg"
          className={inputCls + " font-mono text-xs"}
        />
        {previewUrl && (
          <div className="mt-2 h-36 bg-bg-tertiary overflow-hidden border border-[rgba(240,246,252,0.06)]">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </Field>

      {/* Screenshots */}
      <Field
        label="Screenshots / captures"
        hint="Galerie dans le modal — colle des liens ou chemins locaux"
      >
        <ScreenshotsInput
          urls={form.screenshots ?? []}
          onChange={(u) => set("screenshots", u)}
        />
      </Field>

      {/* Video */}
      <Field
        label="Vidéo de présentation"
        hint="Lien YouTube (youtube.com/watch?v=… ou youtu.be/…) ou chemin vers un .mp4 local"
      >
        <input
          value={form.video ?? ""}
          onChange={(e) => set("video", e.target.value || undefined)}
          placeholder="https://www.youtube.com/watch?v=XXXXXXXXX"
          className={inputCls + " font-mono text-xs"}
        />
        {videoPreview && (
          <div className="mt-2 aspect-video bg-bg-tertiary overflow-hidden border border-[rgba(240,246,252,0.06)]">
            <VideoEmbed url={videoPreview} />
          </div>
        )}
      </Field>

      {/* Links */}
      <div className="space-y-3 p-4 bg-bg-tertiary/30 border border-[rgba(240,246,252,0.06)]">
        <p className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
          Liens du projet
        </p>
        <Field label="GitHub">
          <input
            value={form.links?.github ?? ""}
            onChange={(e) => setLink("github", e.target.value)}
            placeholder="https://github.com/ton-compte/ton-repo"
            className={inputCls + " font-mono text-xs"}
          />
        </Field>
        <Field label="Itch.io">
          <input
            value={form.links?.itch ?? ""}
            onChange={(e) => setLink("itch", e.target.value)}
            placeholder="https://ton-compte.itch.io/ton-jeu"
            className={inputCls + " font-mono text-xs"}
          />
        </Field>
        <Field label="Démo live">
          <input
            value={form.links?.demo ?? ""}
            onChange={(e) => setLink("demo", e.target.value)}
            placeholder="https://ton-jeu.com"
            className={inputCls + " font-mono text-xs"}
          />
        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={!canSave}
          className="flex-1 font-mono text-xs tracking-widest uppercase py-3 bg-accent-primary text-bg-primary hover:bg-accent-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Sauvegarder le projet
        </button>
        <button
          onClick={onCancel}
          className="px-5 font-mono text-xs tracking-widest uppercase border border-[rgba(240,246,252,0.08)] text-text-secondary hover:border-text-secondary transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

// ── Projects list ─────────────────────────────────────────────────────────────────
export function ProjectsEditor({
  data,
  onSave,
  onCancel,
}: {
  data: ProjectsData;
  onSave: (d: ProjectsData) => void;
  onCancel: () => void;
}) {
  const [projects, setProjects] = useState<Project[]>(data.items);
  const [editing, setEditing] = useState<Project | null>(null);

  const persist = (items: Project[]) => {
    setProjects(items);
    onSave({ ...data, items });
  };

  const saveProject = (updated: Project) => {
    const exists = projects.some((p) => p.id === updated.id);
    persist(exists ? projects.map((p) => (p.id === updated.id ? updated : p)) : [...projects, updated]);
    setEditing(null);
  };

  const deleteProject = (id: string) => {
    const p = projects.find((p) => p.id === id);
    if (p && confirm(`Supprimer "${p.title}" ?`)) persist(projects.filter((p) => p.id !== id));
  };

  if (editing) {
    return (
      <ProjectForm
        project={editing}
        onSave={saveProject}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-body font-semibold text-text-primary">Mes projets</h3>
          <p className="font-mono text-[10px] text-text-muted mt-0.5">
            {projects.length} projet{projects.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setEditing(emptyProject())}
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-3 py-2 border border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10 transition-colors"
        >
          <Plus size={11} />
          Nouveau projet
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {projects.length === 0 && (
          <p className="font-mono text-xs text-text-muted text-center py-8">
            Aucun projet — clique sur &ldquo;Nouveau projet&rdquo; pour commencer
          </p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-3 bg-bg-secondary border border-[rgba(240,246,252,0.08)] hover:border-accent-primary/20 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-16 h-11 bg-bg-tertiary overflow-hidden shrink-0 border border-[rgba(240,246,252,0.06)]">
              {p.image ? (
                <img
                  src={p.image}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <span className="font-mono text-[10px]">IMG</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {p.highlight && (
                  <Star size={9} className="text-accent-primary shrink-0" />
                )}
                <span className="font-body text-sm text-text-primary truncate">
                  {p.title || "Sans titre"}
                </span>
              </div>
              <p className="font-mono text-[10px] text-text-muted truncate">
                {p.engine} · {p.type || "—"} · {p.year} ·{" "}
                <span
                  style={{
                    color:
                      p.status === "Terminé"
                        ? "var(--accent-primary)"
                        : p.status === "En cours"
                        ? "var(--accent-secondary)"
                        : "var(--text-muted)",
                  }}
                >
                  {p.status}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => setEditing(p)}
                className="w-8 h-8 flex items-center justify-center border border-[rgba(240,246,252,0.08)] text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all"
                aria-label="Modifier"
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="w-8 h-8 flex items-center justify-center border border-[rgba(240,246,252,0.08)] text-text-secondary hover:border-accent-secondary hover:text-accent-secondary transition-all"
                aria-label="Supprimer"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[rgba(240,246,252,0.06)]">
        <button
          onClick={onCancel}
          className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          ← Retour au panneau
        </button>
      </div>
    </div>
  );
}
