import {
  Mail,
  Github,
  Linkedin,
  Instagram,
  MapPin,
  CalendarCheck,
  FileText,
  type LucideIcon,
} from "lucide-react";

/* ─── Single source of truth for everything on the /contact page ──────────────
   Edit links, copy, and availability here — the page reads from this file.
──────────────────────────────────────────────────────────────────────────── */

const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? "";

export const CONTACT = {
  /* Header */
  title: "Get in",
  accent: "Touch",
  intro:
    "Have a role, a project, or just an idea worth building? I'm always up for a good conversation — drop a line and I'll get back to you.",

  /* Primary channel */
  email: "ofc.avneesh@gmail.com",

  /* Quick facts shown as chips */
  facts: [
    { icon: MapPin, label: "Based in", value: "Ghazipur, India" },
    { icon: CalendarCheck, label: "Status", value: "Open to offers" },
  ] as ContactFact[],

  /* Footer note under the cards */
  note: "Usually replies within a day.",
} as const;

export interface ContactFact {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface ContactChannel {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  /** open in a new tab (off for mailto/tel) */
  external?: boolean;
  /** force a download instead of navigation */
  download?: boolean;
}

export const CHANNELS: ContactChannel[] = [
  {
    icon: Mail,
    label: "Email",
    value: "ofc.avneesh@gmail.com",
    href: "mailto:ofc.avneesh@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "in/avneesh-rai",
    href: "https://www.linkedin.com/in/avneesh-rai/",
    external: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@avneeshrai07",
    href: "https://github.com/avneeshrai07",
    external: true,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@justavneesh",
    href: "https://www.instagram.com/justavneesh/",
    external: true,
  },
  {
    icon: FileText,
    label: "Résumé",
    value: "Download PDF",
    href: `${CDN}/resume.pdf`,
    external: true,
    download: true,
  },
];
