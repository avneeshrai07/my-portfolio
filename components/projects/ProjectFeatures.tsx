import SectionLabel from './SectionLabel'
import type { ProjectFeature } from '@/types/projects'

interface Props {
  features: ProjectFeature[]
}

export default function ProjectFeatures({ features }: Props) {
  return (
    <div className="mb-8">
      <SectionLabel>Key Features</SectionLabel>
      <div className="flex flex-col gap-1.5">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex gap-2.5 rounded-[3px] px-3 py-2"
            style={{
              background: 'var(--proj-cream)',
              border: '1px solid var(--proj-border)',
            }}
          >
            <span
              className="mt-0.5 shrink-0 font-mono text-[9px]"
              style={{ color: 'var(--proj-terra)' }}
            >
              ◆
            </span>
            <span
              className="font-sans text-[11.5px] leading-[1.55]"
              style={{ color: '#6A4A2C' }}
            >
              <strong
                className="font-semibold"
                style={{ color: 'var(--proj-ink-2)' }}
              >
                {f.title} —{' '}
              </strong>
              {f.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
