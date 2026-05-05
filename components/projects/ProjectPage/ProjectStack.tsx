import SectionLabel from './SectionLabel'

interface Props {
  stack: string[]
}

export default function ProjectStack({ stack }: Props) {
  return (
    <div className="mb-8">
      <SectionLabel>Stack</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-[3px] px-2.5 py-1 font-mono text-[11px] tracking-[0.3px]"
            style={{
              background: 'var(--proj-cream)',
              color: 'var(--proj-ink-3)',
              border: '1px solid var(--proj-border)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
