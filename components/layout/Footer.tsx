export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-hero-gradient"
      style={{ borderTop: "1px solid var(--proj-border-2, #D4B896)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p style={{ fontSize: 13, color: "var(--skin-tone)", opacity: 0.65, letterSpacing: "0.01em" }}>
          © {year} Avneesh Rai — Built with Next.js
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/avneeshrai07"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            style={{ fontSize: 13, fontWeight: 400, color: "var(--suit-brown)" }}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/avneeshrai07"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
            style={{ fontSize: 13, fontWeight: 400, color: "var(--suit-brown)" }}
          >
            LinkedIn
          </a>
          <a
            href="mailto:ofc.avneesh@gmail.com"
            className="transition-opacity hover:opacity-60"
            style={{ fontSize: 13, fontWeight: 400, color: "var(--suit-brown)" }}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
