interface SectionHeaderProps {
  title: string;
  accent: string;
  className?: string;
}

export default function SectionHeader({ title, accent, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <div className="flex-1" style={{ height: "1px", background: "var(--proj-border)" }} />
      <h2
        className="font-super-heading text-super-heading font-extralight leading-none shrink-0"
        style={{
          color: "var(--suit-brown)",
          letterSpacing: "0.04em",
        }}
      >
        {title}{" "}
        <em
          style={{
            color: "var(--proj-terra)",
            fontStyle: "italic",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          {accent}
        </em>
      </h2>
      <div className="flex-1" style={{ height: "1px", background: "var(--proj-border)" }} />
    </div>
  );
}
