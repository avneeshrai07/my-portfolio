"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Story",    href: "#journey"  },
  { label: "Projects", href: "#projects" },
  { label: "Music",    href: "#music"    },
  { label: "About",    href: "#about"    },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(235,231,214,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,168,112,0.3)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo / name */}
        <a
          href="#"
          className="font-super-heading font-light tracking-tight transition-opacity hover:opacity-70"
          style={{ fontSize: 18, color: "var(--suit-brown)" }}
        >
          Avneesh<em style={{ color: "var(--proj-terra)", fontStyle: "italic" }}>.</em>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="transition-opacity hover:opacity-60"
              style={{ fontSize: 13, fontWeight: 400, color: "var(--suit-brown)", letterSpacing: "0.04em" }}
            >
              {label}
            </a>
          ))}
          <a
            href={`${process.env.NEXT_PUBLIC_CDN_URL}/resume.pdf`}
            download
            className="px-4 py-2 rounded-full font-normal tracking-wide transition-all duration-200 hover:opacity-80"
            style={{
              fontSize: 12,
              background: "var(--suit-brown)",
              color: "var(--proj-cream)",
              border: "none",
            }}
          >
            Resume
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-0.5 w-5 transition-all duration-200"
              style={{ background: "var(--suit-brown)" }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4 border-t"
          style={{
            background: "rgba(235,231,214,0.96)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(200,168,112,0.3)",
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="transition-opacity hover:opacity-60"
              style={{ fontSize: 15, fontWeight: 400, color: "var(--suit-brown)", paddingBlock: 4 }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href={`${process.env.NEXT_PUBLIC_CDN_URL}/resume.pdf`}
            download
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-normal tracking-wide w-fit"
            style={{ fontSize: 13, background: "var(--suit-brown)", color: "var(--proj-cream)" }}
          >
            Resume
          </a>
        </div>
      )}
    </header>
  );
}
