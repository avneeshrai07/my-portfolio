import SectionLabel from './SectionLabel'

interface Props {
  challenges: string[]
}

export default function ProjectChallenges({ challenges }: Props) {
  return (
    <div className="mb-7">
      <SectionLabel>Engineering Challenges</SectionLabel>
      <div className="flex flex-col gap-2">
        {challenges.map((ch, i) => (
          <div key={i} className="flex gap-3">
            <span
              className="mt-0.5 shrink-0 font-mono text-[10px]"
              style={{ color: 'var(--proj-terra)' }}
            >
              {String(i + 1).padStart(2, '0')}.
            </span>
            <span
              className="font-sans text-[12.5px] leading-[1.6]"
              style={{ color: 'var(--proj-ink-3)' }}
            >
              {ch}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
