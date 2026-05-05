import SectionLabel from './SectionLabel'
import type { ProjectMetric } from '@/types/projects'

interface Props {
  metrics: ProjectMetric[]
}

export default function ProjectMetrics({ metrics }: Props) {
  return (
    <div>
      <SectionLabel>Metrics</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-[4px] px-3 py-3"
            style={
              m.highlight
                ? {
                    background: 'var(--proj-bark)',
                    border: '1px solid var(--proj-bark)',
                  }
                : {
                    background: 'var(--proj-cream)',
                    border: '1px solid var(--proj-border)',
                  }
            }
          >
            <span
              className="block font-mono text-[20px] font-bold leading-none mb-1"
              style={{ color: m.highlight ? '#F5DCC0' : 'var(--proj-ink-3)' }}
            >
              {m.value}
            </span>
            <span
              className="font-mono text-[9px] uppercase tracking-[1.2px]"
              style={{ color: m.highlight ? '#B88A68' : 'var(--proj-ink-4)' }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
