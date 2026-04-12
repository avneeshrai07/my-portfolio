import SectionLabel from './SectionLabel'

interface Props {
  overview: string
}

export default function ProjectOverview({ overview }: Props) {
  return (
    <div className="mb-7">
      <SectionLabel>Overview</SectionLabel>
      <p
        className="font-sans text-[13px] leading-[1.75]"
        style={{ color: 'var(--proj-ink-3)' }}
      >
        {overview}
      </p>
    </div>
  )
}
