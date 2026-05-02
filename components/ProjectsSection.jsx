'use client';

import ProjectCard from '@/components/projects/ProjectCard';
import projects from '@/data/projects.json';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full py-16 md:py-24 px-6 md:px-12 lg:px-20">

      {/* ── Section header ── */}
      <div className="mb-12 md:mb-20">
        <h1
          className="text-[28px] md:text-[36px] lg:text-[42px] text-center font-light tracking-tight"
          style={{ color: "var(--suit-brown)" }}
        >
          See What I’ve Built
        </h1>
        <div className="w-[75vw] h-px mt-4 mx-auto" style={{ background: "var(--suit-brown)" }} />
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