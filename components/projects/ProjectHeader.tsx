import type { Project } from '@/types/projects'

interface Props {
  project: Project
}

export default function ProjectHeader({ project }: Props) {
  return (
    <div className="mb-7">
      {/* project_01 */}
      <p
        className="mb-3 font-mono text-[10px] tracking-[2px]"
        style={{ color: 'var(--proj-border)' }}
      >
        project_{project.num}
      </p>

      {/* Name */}
      <h2
        className="mb-1.5 font-sans text-[28px] font-bold leading-tight"
        style={{ color: 'var(--proj-ink)' }}
      >
        {project.name}
      </h2>

      {/* Tagline */}
      <p
        className="mb-5 font-mono text-[11px] tracking-[0.3px]"
        style={{ color: 'var(--proj-ink-4)' }}
      >
        {project.sub}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag.label}
            className="rounded-sm px-2.5 py-0.5 font-mono text-[10px] tracking-[0.5px]"
            style={
              tag.type === 'live'
                ? {
                    background: 'var(--proj-tag-live-bg)',
                    color: 'var(--proj-tag-live-tx)',
                    border: '1px solid var(--proj-tag-live-bd)',
                  }
                : {
                    background: 'var(--proj-sand)',
                    color: 'var(--proj-ink-3)',
                    border: '1px solid var(--proj-border)',
                  }
            }
          >
            {tag.type === 'live' ? `● ${tag.label}` : tag.label}
          </span>
        ))}
      </div>
    </div>
  )
}
