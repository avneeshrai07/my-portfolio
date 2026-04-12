'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Project } from '@/types/project.types'
import projectsData from '@/data/projects.json'

import ProjectHeader    from './ProjectHeader'
import ProjectOverview  from './ProjectOverview'
import ProjectProblem   from './ProjectProblem'
import ProjectChallenges from './ProjectChallenges'
import ProjectDecisions  from './ProjectDecisions'
import ProjectStack      from './ProjectStack'
import ProjectDiagram    from './ProjectDiagram'
import ProjectFeatures   from './ProjectFeatures'
import ProjectMetrics    from './ProjectMetrics'
import ProjectNav        from './ProjectNav'

const projects = projectsData as Project[]

export default function ProjectsCarousel() {
  const [cur, setCur] = useState(0)

  const go = useCallback(
    (dir: 1 | -1) =>
      setCur((c) => (c + dir + projects.length) % projects.length),
    []
  )

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft')  go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const p        = projects[cur]
  const prevName = projects[(cur - 1 + projects.length) % projects.length].name
  const nextName = projects[(cur + 1) % projects.length].name

  return (
    <section className="w-full" aria-label="Backend projects carousel">
      {/* ── Top bar ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-8 py-3"
        style={{
          background: 'var(--proj-sand)',
          borderBottom: '1px solid var(--proj-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: 'var(--proj-terra)' }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-[2px]"
            style={{ color: 'var(--proj-ink-4)' }}
          >
            backend projects
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[11px]"
            style={{ color: 'var(--proj-border)' }}
          >
            {String(cur + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <button
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] font-mono text-[13px] transition-colors"
            style={{
              background: 'none',
              border: '1px solid var(--proj-border)',
              color: 'var(--proj-ink-4)',
            }}
          >
            ←
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next project"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] font-mono text-[13px] transition-colors"
            style={{
              background: 'none',
              border: '1px solid var(--proj-border)',
              color: 'var(--proj-ink-4)',
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* ── Two-column body ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row">

        {/* LEFT — 60% */}
        <div
          className="flex flex-col px-10 py-10 md:w-[60%]"
          style={{
            background: 'var(--proj-cream)',
            borderRight: '1px solid var(--proj-border-2)',
          }}
        >
          <ProjectHeader    project={p} />
          <ProjectOverview  overview={p.overview} />
          <ProjectProblem   problem={p.problem} />
          <ProjectChallenges challenges={p.challenges} />
          <ProjectDecisions  decisions={p.decisions} />
          <ProjectNav
            project={p}
            total={projects.length}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            prevName={prevName}
            nextName={nextName}
          />
        </div>

        {/* RIGHT — 40% */}
        <div
          className="flex flex-col gap-8 px-8 py-10 md:w-[40%]"
          style={{ background: 'var(--proj-sand)' }}
        >
          <ProjectStack   stack={p.stack} />
          <div>
            <div
              className="mb-2.5 flex items-center gap-2"
            >
              <span
                className="shrink-0 font-mono text-[9px] uppercase tracking-[2px]"
                style={{ color: 'var(--proj-border)' }}
              >
                Architecture
              </span>
              <span
                className="h-px flex-1"
                style={{ background: 'var(--proj-border-2)' }}
              />
            </div>
            <ProjectDiagram type={p.diagramType} />
          </div>
          <ProjectFeatures features={p.features} />
          <ProjectMetrics  metrics={p.metrics} />
        </div>
      </div>
    </section>
  )
}
