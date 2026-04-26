import { promises as fs } from "fs";
import path from "path";
import { Section, getVisibleSections } from "@/lib/sections";
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

  return (
    <>
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
