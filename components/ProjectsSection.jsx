'use client';

import ProjectShowcase from '@/components/projects/HomePageProject/ProjectShowcase';
import SectionHeader from '@/components/shared/SectionHeader';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full" style={{ paddingBlock: 'clamp(2.5rem, 5vw, 4rem)' }}>

      {/* Section header */}
      <div className="section-container mb-3 md:mb-4">
        <SectionHeader title="Recent" accent="Builds" />
      </div>
      <p
        className="mx-auto mb-6 max-w-[52ch] px-5 text-center text-[clamp(0.8438rem,0.4284rem_+_0.5192vw,1.0125rem)] leading-[1.6] md:mb-8"
        style={{ color: 'var(--proj-ink-3, #5A3E28)' }}
      >
        Eight systems taken from first line to production — async pipelines, multi-tenant
        AWS infrastructure, and two agentic AI engines, each built and shipped end to end.
      </p>

      {/* Flagship preview + compact grid — hover (or focus) any tile to bring it up top */}
      <div className="section-container">
        <ProjectShowcase />
      </div>

    </section>
  );
};

export default ProjectsSection;
