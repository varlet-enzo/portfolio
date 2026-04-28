"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Section, ProjectsData } from "@/lib/sections";
import { ProjectsEditor } from "./ProjectsEditor";
import {
  Eye, EyeOff, GripVertical, Edit2, Save, X, Plus,
  ExternalLink, Lock, LogOut, RefreshCw,
} from "lucide-react";

// ── Auth wall ──────────────────────────────────────────────────────────────────
function AuthWall({ onAuth }: { onAuth: (pw: string, code?: string) => Promise<"ok" | "totp_required" | "error"> }) {
  const [step, setStep] = useState<"password" | "totp">("password");
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 3) { setError("Mot de passe trop court"); return; }
    setChecking(true);
    const result = await onAuth(pw);
    setChecking(false);
    if (result === "totp_required") { setStep("totp"); setError(""); }
    else if (result === "ok") { /* accès accordé */ }
    else setError("Mot de passe invalide");
  };

  const submitTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setError("Le code doit avoir 6 chiffres"); return; }
    setChecking(true);
    const result = await onAuth(pw, code);
    setChecking(false);
    if (result !== "ok") { setError("Code invalide ou expiré"); setCode(""); }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm p-8 bg-bg-secondary border border-[rgba(240,246,252,0.08)] rounded-sm"
      >
        <div className="flex items-center gap-3 mb-8">
          <Lock size={16} className="text-accent-primary" />
          <h1 className="font-display text-2xl text-text-primary tracking-wider">ADMIN</h1>
          {step === "totp" && (
            <span className="ml-auto font-mono text-[10px] text-text-muted border border-[rgba(240,246,252,0.12)] px-2 py-0.5">2FA</span>
          )}
        </div>

        {step === "password" ? (
          <form onSubmit={submitPassword} className="space-y-4">
            <input type="text" name="username" autoComplete="username" value="admin" readOnly style={{ display: "none" }} />
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              placeholder="Mot de passe"
              autoComplete="current-password"
              className="w-full bg-bg-tertiary border border-[rgba(240,246,252,0.08)] text-text-primary font-mono text-sm px-4 py-3 outline-none focus:border-accent-primary transition-colors"
            />
            {error && <p className="font-mono text-xs text-accent-secondary">{error}</p>}
            <button
              type="submit"
              disabled={checking}
              className="w-full font-mono text-xs tracking-widest uppercase py-3 bg-accent-primary text-bg-primary hover:bg-accent-primary/80 disabled:opacity-60 transition-colors"
            >
              {checking ? "Vérification…" : "Connexion →"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitTotp} className="space-y-4">
            <p className="font-body text-sm text-text-secondary mb-4">
              Ouvre Google Authenticator et entre le code à 6 chiffres.
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
              placeholder="000000"
              autoFocus
              className="w-full bg-bg-tertiary border border-[rgba(240,246,252,0.08)] text-text-primary font-mono text-2xl tracking-[0.5em] text-center px-4 py-3 outline-none focus:border-accent-primary transition-colors"
            />
            {error && <p className="font-mono text-xs text-accent-secondary">{error}</p>}
            <button
              type="submit"
              disabled={checking || code.length !== 6}
              className="w-full font-mono text-xs tracking-widest uppercase py-3 bg-accent-primary text-bg-primary hover:bg-accent-primary/80 disabled:opacity-60 transition-colors"
            >
              {checking ? "Vérification…" : "Valider →"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("password"); setCode(""); setError(""); }}
              className="w-full font-mono text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              ← Retour
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ── Sortable row ────────────────────────────────────────────────────────────────
function SortableRow({
  section,
  onToggle,
  onEdit,
}: {
  section: Section;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-bg-secondary border border-[rgba(240,246,252,0.08)] rounded-sm hover:border-accent-primary/20 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-text-muted hover:text-text-secondary cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-accent-primary border border-accent-primary/30 px-1.5 py-0.5 rounded-sm uppercase">
            {section.type}
          </span>
          <span className="font-body text-sm text-text-primary truncate">{section.title}</span>
        </div>
        <span className="font-mono text-[10px] text-text-muted"># {section.id}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-all ${
            section.visible
              ? "border-accent-primary/40 text-accent-primary bg-accent-primary/10"
              : "border-[rgba(240,246,252,0.08)] text-text-muted"
          }`}
          title={section.visible ? "Masquer" : "Afficher"}
        >
          {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
        <button
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center rounded-sm border border-[rgba(240,246,252,0.08)] text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all"
        >
          <Edit2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ── Section editor ──────────────────────────────────────────────────────────────
function SectionEditor({
  section,
  onSave,
  onCancel,
}: {
  section: Section;
  onSave: (updated: Section) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState(() => JSON.stringify(section.data, null, 2));
  const [title, setTitle] = useState(section.title);
  const [parseError, setParseError] = useState(false);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(data);
      setParseError(false);
      onSave({ ...section, title, data: parsed });
    } catch {
      setParseError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-bg-primary/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-bg-secondary border border-[rgba(240,246,252,0.12)] rounded-sm max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(240,246,252,0.08)]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-accent-primary border border-accent-primary/30 px-1.5 py-0.5">{section.type}</span>
            <span className="font-body text-sm text-text-primary">Éditer la section</span>
          </div>
          <button onClick={onCancel} className="text-text-muted hover:text-text-primary">
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="font-mono text-[10px] text-text-muted tracking-widest uppercase block mb-2">
              Titre (nav)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-tertiary border border-[rgba(240,246,252,0.08)] text-text-primary font-body text-sm px-3 py-2 outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-text-muted tracking-widest uppercase block mb-2">
              Données (JSON)
            </label>
            <textarea
              value={data}
              onChange={(e) => { setData(e.target.value); setParseError(false); }}
              rows={16}
              className={`w-full bg-bg-tertiary border text-text-primary font-mono text-xs px-3 py-2 outline-none transition-colors resize-none ${
                parseError ? "border-accent-secondary" : "border-[rgba(240,246,252,0.08)] focus:border-accent-primary"
              }`}
            />
            {parseError && (
              <p className="font-mono text-xs text-accent-secondary mt-1">JSON invalide</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-[rgba(240,246,252,0.08)]">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 bg-accent-primary text-bg-primary hover:bg-accent-primary/80 transition-colors"
          >
            <Save size={12} />
            Sauvegarder
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 border border-[rgba(240,246,252,0.08)] text-text-secondary hover:border-text-secondary transition-colors"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main admin ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [totpSetup, setTotpSetup] = useState<{ secret: string; qrDataUrl: string } | null>(null);
  const [totpConfigured, setTotpConfigured] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchSections = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/sections");
      if (res.ok) {
        const data = await res.json();
        setSections(data);
        setPassword(pw);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuth = async (pw: string, totpCode?: string): Promise<"ok" | "totp_required" | "error"> => {
    if (!totpCode) {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) return "error";
      const data = await res.json();
      if (!data.totpRequired) {
        setTotpConfigured(false);
        fetchSections(pw);
        return "ok";
      }
      return "totp_required";
    }
    const res = await fetch("/api/admin/totp/verify", {
      method: "POST",
      headers: { "x-admin-password": pw, "x-totp-code": totpCode },
    });
    if (!res.ok) return "error";
    const data = await res.json();
    if (data.totpSkipped) setTotpConfigured(false);
    fetchSections(pw);
    return "ok";
  };

  const startTotpSetup = async () => {
    if (!password) return;
    const res = await fetch("/api/admin/totp/setup", {
      method: "POST",
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      const data = await res.json();
      setTotpSetup(data);
    }
  };

  const save = async (updated: Section[]) => {
    if (!password) return;
    setLoading(true);
    const res = await fetch("/api/sections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(updated),
    });
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setPassword(null);
    }
  };

  const toggleVisible = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setSections(updated);
    save(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sections.findIndex((s) => s.id === active.id);
    const newIdx = sections.findIndex((s) => s.id === over.id);
    const reordered = [...sections];
    const [moved] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, moved);
    const withOrder = reordered.map((s, i) => ({ ...s, order: i + 1 }));
    setSections(withOrder);
    save(withOrder);
  };

  const handleEditSave = (updated: Section) => {
    const newSections = sections.map((s) => (s.id === updated.id ? updated : s));
    setSections(newSections);
    save(newSections);
    setEditingSection(null);
  };

  const addCustomSection = () => {
    const newSection: Section = {
      id: `custom-${Date.now()}`,
      type: "custom",
      title: "Nouvelle section",
      visible: true,
      order: sections.length + 1,
      data: { html: "<p>Contenu de la section</p>" },
    };
    const updated = [...sections, newSection];
    setSections(updated);
    save(updated);
  };

  if (!password) {
    return <AuthWall onAuth={handleAuth} />;
  }

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-[rgba(240,246,252,0.08)] bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl text-accent-primary">ADMIN</span>
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs text-accent-primary"
              >
                ✓ Sauvegardé
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent-primary transition-colors"
            >
              <ExternalLink size={11} />
              Voir le site
            </a>
            <button
              onClick={() => fetchSections(password)}
              className="text-text-muted hover:text-accent-primary transition-colors"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setPassword(null)}
              className="text-text-muted hover:text-accent-secondary transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* 2FA setup banner */}
        {!totpConfigured && !totpSetup && (
          <div className="p-4 border border-accent-primary/30 bg-accent-primary/5 rounded-sm flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-accent-primary tracking-widest uppercase mb-1">Double authentification non configurée</p>
              <p className="font-body text-xs text-text-secondary">Protège ton admin avec Google Authenticator.</p>
            </div>
            <button
              onClick={startTotpSetup}
              className="shrink-0 font-mono text-xs tracking-widest uppercase px-3 py-2 border border-accent-primary text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              Configurer →
            </button>
          </div>
        )}

        {/* 2FA QR code setup modal */}
        {totpSetup && (
          <div className="p-6 border border-accent-primary/30 bg-accent-primary/5 rounded-sm space-y-4">
            <p className="font-mono text-xs text-accent-primary tracking-widest uppercase">Configuration 2FA</p>
            <p className="font-body text-sm text-text-secondary">
              1. Scanne ce QR code avec Google Authenticator.<br />
              2. Ajoute <code className="font-mono text-xs bg-bg-tertiary px-1 py-0.5">TOTP_SECRET</code> à tes variables d&apos;environnement (Vercel + <code className="font-mono text-xs bg-bg-tertiary px-1 py-0.5">.env.local</code>).
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img src={totpSetup.qrDataUrl} alt="QR Code 2FA" className="w-40 h-40 border border-[rgba(240,246,252,0.12)] rounded-sm" />
              <div className="space-y-2 flex-1">
                <p className="font-mono text-[10px] text-text-muted tracking-widest uppercase">Secret à copier dans les env vars :</p>
                <code className="block font-mono text-xs text-accent-primary bg-bg-tertiary border border-accent-primary/20 px-3 py-2 rounded-sm break-all select-all">
                  TOTP_SECRET={totpSetup.secret}
                </code>
                <p className="font-body text-xs text-text-muted">Après avoir ajouté la variable et redéployé, le code Google Authenticator sera requis à chaque connexion.</p>
              </div>
            </div>
            <button
              onClick={() => setTotpSetup(null)}
              className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Fermer
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-body font-semibold text-text-primary">Sections</h2>
            <p className="font-mono text-xs text-text-muted mt-0.5">
              Glisser pour réordonner · toggle pour masquer
            </p>
          </div>
          <button
            onClick={addCustomSection}
            className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-3 py-2 border border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10 transition-colors"
          >
            <Plus size={11} />
            Section
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sorted.map((section) => (
                <SortableRow
                  key={section.id}
                  section={section}
                  onToggle={() => toggleVisible(section.id)}
                  onEdit={() => setEditingSection(section)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Projects editor — full-page form instead of modal */}
      {editingSection?.type === "projects" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-md overflow-y-auto"
        >
          <div className="max-w-2xl mx-auto px-6 py-10">
            <ProjectsEditor
              data={editingSection.data as ProjectsData}
              onSave={(d) => handleEditSave({ ...editingSection, data: d })}
              onCancel={() => setEditingSection(null)}
            />
          </div>
        </motion.div>
      )}

      {/* Generic JSON editor modal for all other sections */}
      <AnimatePresence>
        {editingSection && editingSection.type !== "projects" && (
          <SectionEditor
            section={editingSection}
            onSave={handleEditSave}
            onCancel={() => setEditingSection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
