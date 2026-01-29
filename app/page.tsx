import { PROJECTS, TECH_STACK } from '@/lib/constants';
import ProjectCard from '@/components/projects/ProjectCard';
import { TechStack } from '@/types/project.types';

export default function Home() {
  const featuredProjects = PROJECTS.filter((p) => p.featured);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Your Name
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            Python Developer & Full-Stack Engineer
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Building high-performance APIs, progressive web apps, and scalable systems.
            Transitioning Python expertise into modern web development.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4 py-12 max-w-6xl">
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
      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">All Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="compact"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

