// ✅ Correct — matches your actual folder structure
import ProjectCard from "@/components/projects/ProjectCard";
import { sunakku } from "@/components/data/projects/sunakku";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        <ProjectCard project={sunakku} />
        {/* add more cards here */}
      </div>
    </main>
  );
}