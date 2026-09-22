"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Plus, Trash2, ArrowLeft, FileText, ChevronRight } from "lucide-react";
import { CVData, CVProject } from "@/lib/cv-generator";

const inputCls =
  "w-full bg-bg-tertiary border border-[rgba(240,246,252,0.08)] text-text-primary font-body text-sm px-3 py-2 outline-none focus:border-accent-primary transition-colors";
const labelCls = "font-mono text-[10px] text-text-muted tracking-widest uppercase block mb-1";

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

function BulletList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className={labelCls}>{label}</label>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="font-mono text-[10px] text-accent-primary hover:text-accent-primary/70 flex items-center gap-1"
        >
          <Plus size={10} /> Ajouter
        </button>
      </div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-text-muted hover:text-accent-secondary transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type Tab = "contact" | "profil" | "formation" | "benevolat" | "projets" | "competences" | "interets";

const TABS: { id: Tab; label: string }[] = [
  { id: "contact", label: "Contact" },
  { id: "profil", label: "Profil" },
  { id: "formation", label: "Formation" },
  { id: "benevolat", label: "Bénévolat" },
  { id: "projets", label: "Projets" },
  { id: "competences", label: "Compétences" },
  { id: "interets", label: "Intérêts" },
];

function emptyProject(): CVProject {
  return {
    name: "",
    yearFr: "",
    yearEn: "",
    role: "",
    bulletsFr: [],
    bulletsEn: [],
    tech: "",
    linkLabel: "",
    linkUrl: "",
  };
}

function ProjectForm({
  project,
  onChange,
  onBack,
}: {
  project: CVProject;
  onChange: (p: CVProject) => void;
  onBack: () => void;
}) {
  const set = <K extends keyof CVProject>(k: K, v: CVProject[K]) => onChange({ ...project, [k]: v });
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text-primary transition-colors mb-2"
      >
        <ArrowLeft size={12} /> Retour aux projets
      </button>
      <Field label="Nom du projet" value={project.name} onChange={(v) => set("name", v)} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Année (FR)" value={project.yearFr} onChange={(v) => set("yearFr", v)} />
        <Field label="Année (EN)" value={project.yearEn} onChange={(v) => set("yearEn", v)} />
      </div>
      <Field label="Rôle" value={project.role} onChange={(v) => set("role", v)} />
      <BulletList
        label="Points clés (FR)"
        values={project.bulletsFr}
        onChange={(v) => set("bulletsFr", v)}
      />
      <BulletList
        label="Points clés (EN)"
        values={project.bulletsEn}
        onChange={(v) => set("bulletsEn", v)}
      />
      <Field label="Technologies" value={project.tech} onChange={(v) => set("tech", v)} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Label du lien" value={project.linkLabel} onChange={(v) => set("linkLabel", v)} />
        <Field label="URL du lien" value={project.linkUrl} onChange={(v) => set("linkUrl", v)} />
      </div>
    </div>
  );
}

export function CVEditor({ password, onClose }: { password: string; onClose: () => void }) {
  const [data, setData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("contact");
  const [editingProjectIdx, setEditingProjectIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/cv", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Erreur de chargement"); setLoading(false); });
  }, [password]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError("Erreur de sauvegarde");
      }
    } catch {
      setError("Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof CVData>(k: K, v: CVData[K]) =>
    setData((d) => d ? { ...d, [k]: v } : d);

  const updateProject = (idx: number, p: CVProject) =>
    setData((d) => {
      if (!d) return d;
      const projects = [...d.projects];
      projects[idx] = p;
      return { ...d, projects };
    });

  const addProject = () => {
    setData((d) => d ? { ...d, projects: [...d.projects, emptyProject()] } : d);
    setEditingProjectIdx((data?.projects.length ?? 0));
  };

  const removeProject = (idx: number) =>
    setData((d) => d ? { ...d, projects: d.projects.filter((_, i) => i !== idx) } : d);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-bg-primary flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[rgba(240,246,252,0.08)] bg-bg-secondary/50 shrink-0">
        <div className="flex items-center gap-3">
          <FileText size={14} className="text-accent-primary" />
          <span className="font-body text-sm text-text-primary">CV</span>
          <span className="font-mono text-[10px] text-text-muted">public/cv.html</span>
          {saved && (
            <span className="font-mono text-xs text-accent-primary">✓ Sauvegardé</span>
          )}
          {error && (
            <span className="font-mono text-xs text-accent-secondary">{error}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/cv.html"
            target="_blank"
            className="font-mono text-[10px] text-text-muted hover:text-accent-primary transition-colors tracking-widest uppercase"
          >
            Prévisualiser ↗
          </a>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-3 py-1.5 bg-accent-primary text-bg-primary hover:bg-accent-primary/80 disabled:opacity-60 transition-colors"
          >
            <Save size={11} />
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-mono text-xs text-text-muted">Chargement…</span>
        </div>
      ) : !data ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-mono text-xs text-accent-secondary">{error || "Erreur"}</span>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Tab sidebar */}
          <div className="w-40 shrink-0 border-r border-[rgba(240,246,252,0.08)] bg-bg-secondary/30 py-4 flex flex-col gap-0.5 overflow-y-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setEditingProjectIdx(null); }}
                className={`w-full text-left px-4 py-2 font-mono text-xs transition-colors ${
                  tab === t.id
                    ? "text-accent-primary bg-accent-primary/10 border-r-2 border-accent-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form area */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {tab === "contact" && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-mono text-[10px] text-accent-primary tracking-widest uppercase mb-4">Contact &amp; En-tête</h3>
                <Field label="Tagline (FR)" value={data.taglineFr} onChange={(v) => set("taglineFr", v)} />
                <Field label="Tagline (EN)" value={data.taglineEn} onChange={(v) => set("taglineEn", v)} />
                <Field label="Email" value={data.email} onChange={(v) => set("email", v)} />
                <Field label="LinkedIn URL" value={data.linkedin} onChange={(v) => set("linkedin", v)} />
                <Field label="GitHub URL" value={data.github} onChange={(v) => set("github", v)} />
                <Field label="Itch.io URL" value={data.itch} onChange={(v) => set("itch", v)} />
                <Field label="Localisation" value={data.location} onChange={(v) => set("location", v)} />
              </div>
            )}

            {tab === "profil" && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-mono text-[10px] text-accent-primary tracking-widest uppercase mb-4">Profil</h3>
                <Field label="Profil (FR)" value={data.profilFr} onChange={(v) => set("profilFr", v)} textarea rows={4} />
                <Field label="Profil (EN)" value={data.profilEn} onChange={(v) => set("profilEn", v)} textarea rows={4} />
              </div>
            )}

            {tab === "formation" && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-mono text-[10px] text-accent-primary tracking-widest uppercase mb-4">Formation</h3>
                <Field label="Titre (FR)" value={data.formationTitleFr} onChange={(v) => set("formationTitleFr", v)} />
                <Field label="Titre (EN)" value={data.formationTitleEn} onChange={(v) => set("formationTitleEn", v)} />
                <Field label="Dates" value={data.formationDate} onChange={(v) => set("formationDate", v)} />
                <Field label="École" value={data.formationSchool} onChange={(v) => set("formationSchool", v)} />
              </div>
            )}

            {tab === "benevolat" && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-mono text-[10px] text-accent-primary tracking-widest uppercase mb-4">Bénévolat</h3>
                <Field label="Titre (FR)" value={data.benevolaTitleFr} onChange={(v) => set("benevolaTitleFr", v)} />
                <Field label="Titre (EN)" value={data.benevolaTitleEn} onChange={(v) => set("benevolaTitleEn", v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date (FR)" value={data.benevolaDateFr} onChange={(v) => set("benevolaDateFr", v)} />
                  <Field label="Date (EN)" value={data.benevolaDateEn} onChange={(v) => set("benevolaDateEn", v)} />
                </div>
                <Field label="Localisation" value={data.benevolaLocation} onChange={(v) => set("benevolaLocation", v)} />
                <Field label="Description (FR)" value={data.benevolaDescFr} onChange={(v) => set("benevolaDescFr", v)} textarea />
                <Field label="Description (EN)" value={data.benevolaDescEn} onChange={(v) => set("benevolaDescEn", v)} textarea />
              </div>
            )}

            {tab === "projets" && (
              <div className="max-w-2xl">
                {editingProjectIdx !== null && data.projects[editingProjectIdx] ? (
                  <ProjectForm
                    project={data.projects[editingProjectIdx]}
                    onChange={(p) => updateProject(editingProjectIdx, p)}
                    onBack={() => setEditingProjectIdx(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-mono text-[10px] text-accent-primary tracking-widest uppercase">Projets</h3>
                      <button
                        type="button"
                        onClick={addProject}
                        className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase px-3 py-1.5 border border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10 transition-colors"
                      >
                        <Plus size={11} /> Ajouter
                      </button>
                    </div>
                    <div className="space-y-2">
                      {data.projects.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-bg-secondary border border-[rgba(240,246,252,0.08)] hover:border-accent-primary/20 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-text-primary truncate">{p.name || <span className="text-text-muted">Sans titre</span>}</p>
                            <p className="font-mono text-[10px] text-text-muted truncate">{p.role}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingProjectIdx(i)}
                            className="font-mono text-[10px] text-text-muted hover:text-accent-primary transition-colors flex items-center gap-1"
                          >
                            Éditer <ChevronRight size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProject(i)}
                            className="text-text-muted hover:text-accent-secondary transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {data.projects.length === 0 && (
                        <p className="font-mono text-xs text-text-muted text-center py-6">Aucun projet</p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[rgba(240,246,252,0.08)]">
                      <Field
                        label="URL Portfolio (lien « Voir tous mes projets »)"
                        value={data.portfolioUrl}
                        onChange={(v) => set("portfolioUrl", v)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "competences" && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-mono text-[10px] text-accent-primary tracking-widest uppercase mb-4">Compétences</h3>
                <p className="font-mono text-[10px] text-text-muted">Les champs Moteurs / Langages / Outils acceptent du HTML (ex: <code className="bg-bg-tertiary px-1">&lt;strong&gt;Unity&lt;/strong&gt;</code>).</p>
                <Field label="Moteurs (HTML)" value={data.skillsEnginesHtml} onChange={(v) => set("skillsEnginesHtml", v)} />
                <Field label="Langages (HTML)" value={data.skillsLanguagesHtml} onChange={(v) => set("skillsLanguagesHtml", v)} />
                <Field label="Outils (HTML)" value={data.skillsToolsHtml} onChange={(v) => set("skillsToolsHtml", v)} />
                <Field label="Soft skills (FR)" value={data.skillsSoftFr} onChange={(v) => set("skillsSoftFr", v)} />
                <Field label="Soft skills (EN)" value={data.skillsSoftEn} onChange={(v) => set("skillsSoftEn", v)} />
              </div>
            )}

            {tab === "interets" && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-mono text-[10px] text-accent-primary tracking-widest uppercase mb-4">Intérêts</h3>
                <p className="font-mono text-[10px] text-text-muted">Ces champs acceptent du HTML (ex: <code className="bg-bg-tertiary px-1">&lt;strong&gt;...</code>). Pas de version bilingue.</p>
                <Field label="Jeux vidéo (HTML)" value={data.interestJVHtml} onChange={(v) => set("interestJVHtml", v)} textarea />
                <Field label="Escalade (HTML)" value={data.interestEscaladeHtml} onChange={(v) => set("interestEscaladeHtml", v)} />
                <Field label="Anime (HTML)" value={data.interestAnimeHtml} onChange={(v) => set("interestAnimeHtml", v)} />
                <Field label="Série (HTML)" value={data.interestSerieHtml} onChange={(v) => set("interestSerieHtml", v)} />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
