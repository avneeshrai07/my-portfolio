'use client';

import ProjectMasonry from '@/components/projects/HomePageProject/ProjectMasonry';
import SectionHeader from '@/components/shared/SectionHeader';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full section-pad">

      {/* Section header */}
      <div className="mx-auto max-w-6xl px-5 md:px-8 mb-12 md:mb-14">
        <SectionHeader title="Recent" accent="Builds" />
      </div>

      {/* Pinterest-style masonry — each pin links to its full project page */}
      <ProjectMasonry />

    </section>
  );
};

export default ProjectsSection;
