"use client";
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type Lang = "fr" | "en";

const T = {
  fr: {
    scroll: "SCROLL",
    about_label: "01 — À PROPOS",
    about_title: "QUI SUIS-JE ?",
    about_funfacts: "// Fun facts",
    about_info_formation: "Formation",
    about_info_localisation: "Localisation",
    about_info_disponibilite: "Disponibilité",
    about_info_rythme: "Rythme",
    download_cv: "Télécharger mon CV",
    projects_label: "02 — PROJETS",
    projects_title: "MES TRAVAUX",
    projects_all: "Tous",
    projects_view: "VOIR LE PROJET",
    projects_video: "Vidéo de présentation",
    skills_label: "03 — COMPÉTENCES",
    skills_overview: "// Vue d'ensemble",
    timeline_label: "04 — PARCOURS",
    contact_label: "05 — CONTACT",
    contact_title: "TRAVAILLONS ENSEMBLE",
    contact_social: "// Retrouvez-moi sur",
    contact_subject: "Opportunité alternance",
    footer_built: "Built with Next.js + Three.js",
  },
  en: {
    scroll: "SCROLL",
    about_label: "01 — ABOUT",
    about_title: "WHO AM I?",
    about_funfacts: "// Fun facts",
    about_info_formation: "Training",
    about_info_localisation: "Location",
    about_info_disponibilite: "Availability",
    about_info_rythme: "Rhythm",
    download_cv: "Download my CV",
    projects_label: "02 — PROJECTS",
    projects_title: "MY WORK",
    projects_all: "All",
    projects_view: "VIEW PROJECT",
    projects_video: "Presentation video",
    skills_label: "03 — SKILLS",
    skills_overview: "// Overview",
    timeline_label: "04 — JOURNEY",
    contact_label: "05 — CONTACT",
    contact_title: "LET'S WORK TOGETHER",
    contact_social: "// Find me on",
    contact_subject: "Internship opportunity",
    footer_built: "Built with Next.js + Three.js",
  },
} as const;

export type TranslationKey = keyof typeof T.fr;

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "fr",
  toggleLang: () => {},
  t: (key) => T.fr[key],
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-lang") as Lang | null;
    if (saved === "en" || saved === "fr") {
      setLang(saved);
    } else {
      // First visit: detect browser language
      const browserLang = navigator.language.startsWith("en") ? "en" : "fr";
      setLang(browserLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((l) => {
      const next = l === "fr" ? "en" : "fr";
      localStorage.setItem("portfolio-lang", next);
      return next;
    });
  }, []);

  const t = useCallback((key: TranslationKey): string => T[lang][key], [lang]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LangContext);
}
