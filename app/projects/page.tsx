import ProjectCarousel from "@/components/projects/ProjectCarousel";
import { allProjects } from "@/components/data/projects";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-hero-gradient px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Page heading
        <div className="mb-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-pink-400/70 mb-2">
            Work
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Projects
          </h1>
        </div> */}

        {/* Carousel — arrows on both sides like the sketch */}
        <div className="pb-10">
          <ProjectCarousel projects={allProjects} />
        </div>

      </div>
    </main>
  );
}