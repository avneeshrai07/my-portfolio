import { notFound } from 'next/navigation'
import projectsData from '@/data/projects.json'
import type { Project } from '@/types/project.types'

import ProjectHeader     from '@/components/projects/ProjectHeader'
import ProjectOverview   from '@/components/projects/ProjectOverview'
import ProjectProblem    from '@/components/projects/ProjectProblem'
import ProjectChallenges from '@/components/projects/ProjectChallenges'
import ProjectDecisions  from '@/components/projects/ProjectDecisions'
import ProjectStack      from '@/components/projects/ProjectStack'
import ProjectDiagram    from '@/components/projects/ProjectDiagram'
import ProjectFeatures   from '@/components/projects/ProjectFeatures'
import ProjectMetrics    from '@/components/projects/ProjectMetrics'

const projects = projectsData as Project[]

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)
  if (!project) return {}
  return {
    title: `${project.name} — Projects`,
    description: project.sub,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)
  if (!project) notFound()

  const p    = project as Project
  const idx  = projects.findIndex((x) => x.id === p.id)
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]

  return (
    <main className="min-h-screen w-full" style={{ background: 'var(--proj-cream)' }}>

      {/* Top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-8 py-3"
        style={{ background: 'var(--proj-sand)', borderBottom: '1px solid var(--proj-border)' }}
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--proj-terra)' }} />
          <span className="font-mono text-[10px] uppercase tracking-[2px]" style={{ color: 'var(--proj-ink-4)' }}>
            {p.num} — {p.category}
          </span>
        </div>
        <a
          href="/#projects"
          className="font-mono text-[11px] uppercase tracking-[2px] transition-opacity hover:opacity-60"
          style={{ color: 'var(--proj-ink-4)' }}
        >
          ← back
        </a>
      </div>

      {/* Two-column body */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-44px)]">

        {/* LEFT — 60% */}
        <div
          className="flex flex-col px-10 py-10 md:w-[60%]"
          style={{ background: 'var(--proj-cream)', borderRight: '1px solid var(--proj-border-2)' }}
        >
          <ProjectHeader     project={p} />
          <ProjectOverview   overview={p.overview} />
          <ProjectProblem    problem={p.problem} />
          <ProjectChallenges challenges={p.challenges} />
          <ProjectDecisions  decisions={p.decisions} />

          {/* Prev / GitHub / Next */}
          <div
            className="mt-12 flex items-center justify-between border-t pt-6"
            style={{ borderColor: 'var(--proj-border-2)' }}
          >
            {/* Prev */}
            <a href={prev.href} className="group flex flex-col gap-1">
              <span
                className="font-mono text-[9px] uppercase tracking-[2px] transition-opacity group-hover:opacity-60"
                style={{ color: 'var(--proj-ink-4)' }}
              >
                ← prev
              </span>
              <span className="text-[13px] font-light transition-opacity group-hover:opacity-60 text-hero-suit">
                {prev.name}
              </span>
            </a>

            {/* GitHub */}
            {p.githubUrl && (
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 transition-opacity hover:opacity-60"
              >
                <span
                  className="font-mono text-[9px] uppercase tracking-[2px]"
                  style={{ color: 'var(--proj-ink-4)' }}
                >
                  source
                </span>
                {/* GitHub icon */}
                <svg
                  width="15vw"
                  height="7vh"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--proj-bark)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            )}

            {/* Next */}
            <a href={next.href} className="group flex flex-col items-end gap-1">
              <span
                className="font-mono text-[9px] uppercase tracking-[2px] transition-opacity group-hover:opacity-60"
                style={{ color: 'var(--proj-ink-4)' }}
              >
                next →
              </span>
              <span className="text-[13px] font-light transition-opacity group-hover:opacity-60 text-hero-suit">
                {next.name}
              </span>
            </a>
          </div>
        </div>

        {/* RIGHT — 40% */}
        <div
          className="flex flex-col gap-8 px-8 py-10 md:w-[40%]"
          style={{ background: 'var(--proj-sand)' }}
        >
          <ProjectStack   stack={p.stack} />
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span
                className="shrink-0 font-mono text-[9px] uppercase tracking-[2px]"
                style={{ color: 'var(--proj-border)' }}
              >
                Architecture
              </span>
              <span className="h-px flex-1" style={{ background: 'var(--proj-border-2)' }} />
            </div>
            <ProjectDiagram type={p.diagramType} />
          </div>
          <ProjectFeatures features={p.features} />
          <ProjectMetrics  metrics={p.metrics} />
        </div>

      </div>
    </main>
  )
}