'use client';

import ProjectShowcase from '@/components/projects/HomePageProject/ProjectShowcase';
import SectionHeader from '@/components/shared/SectionHeader';

const ProjectsSection = () => {
  return (
    <section
      className="bg-hero-gradient w-full"
      style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)', paddingBottom: 'clamp(1rem, 2vw, 1.5rem)' }}
    >

      {/* Section header */}
      <div className="section-container mb-10 md:mb-16">
        <SectionHeader title="Recent" accent="Builds" />
      </div>

      {/* Flagship preview + compact grid — hover (or focus) any tile to bring it up top */}
      <div className="section-container">
        <ProjectShowcase />
      </div>

    </section>
  );
};

export default ProjectsSection;
