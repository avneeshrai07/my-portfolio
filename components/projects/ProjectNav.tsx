import type { Project } from '@/types/projects'

interface Props {
  project: Project
  total: number
  onPrev: () => void
  onNext: () => void
  prevName: string
  nextName: string
}

export default function ProjectNav({
  project,
  total,
  onPrev,
  onNext,
  prevName,
  nextName,
}: Props) {
  return (
    <div
      className="mt-auto flex items-center gap-2.5 pt-5"
      style={{ borderTop: '1px solid var(--proj-border-2)' }}
    >
      {/* GitHub */}
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-[4px] px-4 py-2 font-mono text-[11px] tracking-[0.5px] transition-opacity hover:opacity-80"
        style={{
          background: 'var(--proj-bark)',
          color: '#F5EDE0',
        }}
      >
        github
      </a>

      {/* Demo — only if demoUrl exists */}
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[4px] px-4 py-2 font-mono text-[11px] tracking-[0.5px] transition-colors hover:opacity-80"
          style={{
            background: 'transparent',
            color: 'var(--proj-ink-4)',
            border: '1px solid var(--proj-border)',
          }}
        >
          live demo
        </a>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onPrev}
          className="cursor-pointer font-mono text-[11px] tracking-[0.5px] transition-colors hover:opacity-80"
          style={{ color: 'var(--proj-border-2)' }}
        >
          ← {prevName.toLowerCase()}
        </button>
        <span style={{ color: 'var(--proj-border)', fontSize: 12 }}>/</span>
        <button
          onClick={onNext}
          className="cursor-pointer font-mono text-[11px] tracking-[0.5px] transition-colors hover:opacity-80"
          style={{ color: 'var(--proj-border-2)' }}
        >
          {nextName.toLowerCase()} →
        </button>
      </div>
    </div>
  )
}
