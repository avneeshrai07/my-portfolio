'use client';

import ProjectCard from '@/components/projects/ProjectCard';
import projects from '@/data/projects.json';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full py-16 md:py-24 px-6 md:px-12 lg:px-20">

      {/* ── Section header ── */}
      <div className="mb-12 md:mb-20">
        <p
          className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase mb-3"
          style={{ color: 'rgba(26,26,26,0.35)' }}
        >
          Selected Work
        </p>
        <h2
          className="text-[28px] md:text-[36px] lg:text-[42px] font-light tracking-tight"
          style={{ color: '#1a1a1a' }}
        >
          Projects
        </h2>
        <div className="w-8 h-px mt-4" style={{ background: 'rgba(0,0,0,0.2)' }} />
      </div>

      {/* ── Project cards — one per row, full width ── */}
      <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
        {projects.map((project) => (
          <ProjectCard key={project.id} data={project} />
        ))}
      </div>

    </section>
  );
};

export default ProjectsSection;