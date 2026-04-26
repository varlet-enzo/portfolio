import { Section, HeroData, AboutData, ProjectsData, SkillsData, TimelineData, ContactData, CustomData } from "@/lib/sections";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import TimelineSection from "./TimelineSection";
import ContactSection from "./ContactSection";
import CustomSection from "./CustomSection";

interface SectionRendererProps {
  section: Section;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection data={section.data as HeroData} />;
    case "about":
      return <AboutSection data={section.data as AboutData} />;
    case "projects":
      return <ProjectsSection data={section.data as ProjectsData} />;
    case "skills":
      return <SkillsSection data={section.data as SkillsData} />;
    case "timeline":
      return <TimelineSection data={section.data as TimelineData} />;
    case "contact":
      return <ContactSection data={section.data as ContactData} />;
    case "custom":
      return (
        <CustomSection
          id={section.id}
          title={section.title}
          data={section.data as CustomData}
          order={section.order}
        />
      );
    default:
      return null;
  }
}
