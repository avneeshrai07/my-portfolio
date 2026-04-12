import SectionLabel from './SectionLabel'

interface Props {
  problem: string
}

export default function ProjectProblem({ problem }: Props) {
  return (
    <div className="mb-7">
      <SectionLabel>Problem</SectionLabel>
      <div
        className="rounded-r-md py-2.5 pl-4 pr-3"
        style={{
          borderLeft: '2px solid var(--proj-terra)',
          background: 'var(--proj-sand)',
        }}
      >
        <p
          className="font-sans text-[12.5px] italic leading-[1.68]"
          style={{ color: 'var(--proj-ink-3)' }}
        >
          {problem}
        </p>
      </div>
    </div>
  )
}
