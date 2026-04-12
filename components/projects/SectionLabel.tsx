interface Props {
  children: string
}

export default function SectionLabel({ children }: Props) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span
        className="shrink-0 font-mono text-[9px] uppercase tracking-[2px]"
        style={{ color: 'var(--proj-border)' }}
      >
        {children}
      </span>
      <span
        className="h-px flex-1"
        style={{ background: 'var(--proj-border-2)' }}
      />
    </div>
  )
}
