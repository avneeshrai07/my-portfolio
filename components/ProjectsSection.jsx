'use client';

import BookCard from '@/components/projects/BookCard';
import projects from '@/data/projects.json';

const ProjectsSection = () => {
  return (
    <section className="bg-hero-gradient w-full py-16 md:py-24 px-6 md:px-12 lg:px-20">
      {/* Section header */}
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

      {/*
        Each grid cell has enough column gap that the 90px slide of the inner
        page lands in the gap, not on top of the next card.
        Right padding on the section gives the last card in each row room too.
        No overflow-hidden — the hovered card needs z-index: 10 to rise visually.
      */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pr-28 md:pr-36"
        style={{
          columnGap: 'clamp(100px, 10vw, 140px)',
          rowGap: 'clamp(48px, 6vw, 80px)',
        }}
      >
        {projects.map((project) => (
          <BookCard
            key={project.id}
            num={project.num}
            title={project.name}
            category={project.category}
            year={project.year}
            stack={project.stack}
            sub={project.sub}
            href={project.href}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;