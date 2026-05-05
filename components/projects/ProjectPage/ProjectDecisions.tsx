import SectionLabel from './SectionLabel'

interface Props {
  decisions: string[]
}

export default function ProjectDecisions({ decisions }: Props) {
  return (
    <div className="mb-7">
      <SectionLabel>Key Decisions</SectionLabel>
      <div className="flex flex-col gap-1.5">
        {decisions.map((dec, i) => (
          <div key={i} className="flex gap-2.5">
            <span
              className="mt-0.5 shrink-0 font-mono text-[10px]"
              style={{ color: 'var(--proj-terra)' }}
            >
              →
            </span>
            <span
              className="font-sans text-[12.5px] leading-[1.6]"
              style={{ color: 'var(--proj-ink-3)' }}
            >
              {dec}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
