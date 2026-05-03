'use client';

import ProjectCard from '@/components/projects/ProjectCard';
import projects from '@/data/projects.json';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full py-16 md:py-24 px-6 md:px-12 lg:px-20">

      <div className="mb-12 md:mb-20 flex items-center gap-6">
  <div className="flex-1" style={{ height: "1px", background: "var(--suit-brown)" }} />

  <h1
    className="text-super-heading font-light font-super-heading tracking-tight shrink-0"
    style={{ color: "var(--suit-brown)" }}
  >
    See What I've{" "}
    <em style={{ color: "var(--proj-terra, #C4694A)", fontStyle: "italic" }}>Built</em>
  </h1>

  <div className="flex-1" style={{ height: "1px", background: "var(--suit-brown)" }} />
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