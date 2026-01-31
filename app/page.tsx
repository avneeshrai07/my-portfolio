import { PROJECTS, TECH_STACK } from "@/lib/constants";
import ProjectCard from "@/components/projects/ProjectCard";
import { TechStack } from "@/types/project.types";
import HeroSection from "@/components/HeroSection";
import MusicSection from "@/components/MusicSection";
import MovieSection from "@/components/MoviesSection";
export default function Home() {
  const featuredProjects = PROJECTS.filter((p) => p.featured);

  return (
    <main className="min-h-screen  ">
      {/* Hero Section */}
      <HeroSection />
      {/* Music Section */}
      <MusicSection />

      <MovieSection />
      {/* Featured Projects */}

      <section className="container  mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="featured"
            />
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(TECH_STACK).map((tech: TechStack) => (
            <div
              key={tech.name}
              className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition text-center"
              style={{ borderColor: `${tech.color}30` }}
            >
              <div className="text-4xl mb-2">{tech.icon}</div>
              <div className="font-semibold">{tech.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* All Projects */}
      <section className="container redcolor mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">All Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} variant="compact" />
          ))}
        </div>
      </section>
    </main>
  );
}
