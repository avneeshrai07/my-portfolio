'use client';

import ProjectCard from '@/components/projects/HomePageProject/ProjectCard';
import ProjectCardMobile from '@/components/projects/HomePageProject/ProjectCardMobile';
import SectionHeader from '@/components/shared/SectionHeader';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full section-pad">

      {/* Section header — padded on both layouts */}
      <div className="px-5 md:px-12 lg:px-20 mb-12 md:mb-16">
        <SectionHeader title="See What I've" accent="Built" />
      </div>

      {/* Mobile: swipeable card + bottom sheet (< lg) */}
      <div className="lg:hidden">
        <ProjectCardMobile />
      </div>

      {/* Desktop: sidebar + detail panel (≥ lg) */}
      <div className="hidden lg:block px-6 lg:px-20">
        <div className="sticky top-16">
          <ProjectCard />
        </div>
      </div>

    </section>
  );
};

export default ProjectsSection;
