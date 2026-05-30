---
name: project-architecture
description: Portfolio design system — shared components, color tokens, font stack, section layout conventions
metadata:
  type: project
---

**Stack:** Next.js App Router, React 19, Tailwind CSS 4, GSAP, shadcn/ui

**Design system (earthy parchment palette):**
- `--hero-bg: #EEEADF` — page background
- `--suit-brown: #513720` — primary text, headings, borders
- `--skin-tone: #c2916d` — secondary text
- `--shirt-tan: #dec09c` — accents, backgrounds
- `--proj-terra: #C4694A` — italic accents in headings
- `--proj-border: #C8A870` — thin lines, card borders
- `--proj-cream: #F5EDE0`, `--proj-sand: #EDE0CC` — card backgrounds

**Font stack:**
- `--font-super-heading`: Cormorant Garamond (section titles, hero subtitle)
- `--font-hero`: Bodoni Moda (large display)
- `--font-heading`: Cinzel
- `--font-body`: Cormorant Garamond (body text)
- `--font-handwriting`: Caveat
- DM Sans + DM Serif Display: used inside ProjectCard for app-like feel

**Shared components:**
- `components/shared/SectionHeader.tsx` — reusable line+title+line section header (props: title, accent)
- `components/layout/Header.tsx` — fixed nav with scroll-blur effect, links to sections by ID
- `components/layout/Footer.tsx` — copyright + GitHub/LinkedIn/Email links

**Section IDs (for nav):** #journey, #projects, #music, #about

**Key CSS utilities (globals.css):**
- `.section-pad` — consistent block padding for all sections
- `.bg-hero-gradient` — parchment background with grain texture
- `.font-super-heading`, `.font-body`, `.font-handwriting` — font family utilities
- All ProjectCard and MyJourney animation keyframes live in globals.css (not inline style blocks)

**Why:** Streamlined from scattered inline `<style>` blocks and duplicate section header patterns into a unified system.
