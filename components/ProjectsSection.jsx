'use client';

import ProjectCard from '@/components/projects/HomePageProject/ProjectCard';
import SectionHeader from '@/components/shared/SectionHeader';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full section-pad px-6 md:px-12 lg:px-20">
      <SectionHeader title="See What I've" accent="Built" className="mb-12 md:mb-20" />
      <div className="sticky top-16">  {/* ← only change */}
        <ProjectCard />
      </div>
    </section>
  );
};

export default ProjectsSection;