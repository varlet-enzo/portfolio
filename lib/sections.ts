// ── Core section types ─────────────────────────────────────────────────────────

export type SectionType =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "timeline"
  | "contact"
  | "custom";

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  titleEn?: string;
  visible: boolean;
  order: number;
  data: SectionData;
}

// ── Per-type data shapes ───────────────────────────────────────────────────────

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroData {
  name: string;
  surname: string;
  tagline: string;
  taglineEn?: string;
  roles: string[];
  rolesEn?: string[];
  ctaLabel: string;
  ctaLabelEn?: string;
  ctaTarget: string;
  availableFor: string;
  availableForEn?: string;
  stats?: HeroStat[];
  statsEn?: HeroStat[];
}

export interface AboutData {
  bio: string;
  bioEn?: string;
  details: {
    formation: string;
    localisation: string;
    disponibilite: string;
    rythme: string;
  };
  funFacts: string[];
  funFactsEn?: string[];
}

export interface ProjectLink {
  github?: string;
  itch?: string;
  demo?: string;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  engine: string;
  year: string;
  status: "Terminé" | "En cours" | "Prototype";
  description: string;
  descriptionEn?: string;
  longDescription: string;
  longDescriptionEn?: string;
  tags: string[];
  image: string;
  screenshots: string[];
  video?: string;
  links: ProjectLink;
  highlight?: boolean;
}

export interface ProjectsData {
  featured: boolean;
  items: Project[];
}

export interface SkillItem {
  name: string;
  level: number;
  icon: string;
}

export interface SkillCategory {
  name: string;
  nameEn?: string;
  items: SkillItem[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export type TimelineEntryType = "formation" | "projet" | "experience" | "recompense";

export interface TimelineEntry {
  id: string;
  year: string;
  type: TimelineEntryType;
  title: string;
  titleEn?: string;
  organization: string;
  description: string;
  descriptionEn?: string;
  tags: string[];
}

export interface TimelineData {
  entries: TimelineEntry[];
}

export interface ContactData {
  email: string;
  linkedin: string;
  github: string;
  itch: string;
  cvUrl: string;
  message: string;
  messageEn?: string;
}

export interface CustomData {
  html?: string;
  markdown?: string;
}

export type SectionData =
  | HeroData
  | AboutData
  | ProjectsData
  | SkillsData
  | TimelineData
  | ContactData
  | CustomData;

// ── Typed section variants ─────────────────────────────────────────────────────

export interface HeroSection extends Section { type: "hero"; data: HeroData }
export interface AboutSection extends Section { type: "about"; data: AboutData }
export interface ProjectsSection extends Section { type: "projects"; data: ProjectsData }
export interface SkillsSection extends Section { type: "skills"; data: SkillsData }
export interface TimelineSection extends Section { type: "timeline"; data: TimelineData }
export interface ContactSection extends Section { type: "contact"; data: ContactData }
export interface CustomSection extends Section { type: "custom"; data: CustomData }

export type TypedSection =
  | HeroSection
  | AboutSection
  | ProjectsSection
  | SkillsSection
  | TimelineSection
  | ContactSection
  | CustomSection;

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getVisibleSections(sections: Section[]): Section[] {
  return sections.filter((s) => s.visible).sort((a, b) => a.order - b.order);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getTagClass(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower.includes("unity")) return "tag-unity";
  if (lower.includes("unreal")) return "tag-unreal";
  if (lower.includes("godot")) return "tag-godot";
  return "tag-default";
}
