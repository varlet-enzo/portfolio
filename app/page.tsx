import { promises as fs } from "fs";
import path from "path";
import { Section, getVisibleSections, ContactData, HeroData } from "@/lib/sections";
import { SITE_URL } from "@/lib/constants";
import SectionRenderer from "@/components/sections/SectionRenderer";
import Navbar from "@/components/layout/Navbar";
import PageLoader from "@/components/layout/PageLoader";
import ScrollProgress from "@/components/layout/ScrollProgress";
import CustomCursor from "@/components/layout/CustomCursor";
import KonamiCode from "@/components/layout/KonamiCode";

async function getSections(): Promise<Section[]> {
  const filePath = path.join(process.cwd(), "content", "sections.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Section[];
}

export default async function Home() {
  const allSections = await getSections();
  const sections = getVisibleSections(allSections);

  let hero: HeroData | undefined;
  let contact: ContactData | undefined;
  for (const s of allSections) {
    if (s.type === "hero") hero = s.data as HeroData;
    else if (s.type === "contact") contact = s.data as ContactData;
    if (hero && contact) break;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: hero ? `${hero.name} ${hero.surname}` : "Enzo Varlet",
    jobTitle: hero?.tagline ?? "Game Developer",
    url: SITE_URL,
    email: contact?.email,
    sameAs: [contact?.linkedin, contact?.github, contact?.itch].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CustomCursor />
      <PageLoader />
      <ScrollProgress />
      <KonamiCode />
      <Navbar sections={sections} />

      <main>
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    </>
  );
}
