import { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/pwa/PWARegister";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SITE_URL = "https://avneeshrai.com";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL ?? "";
const OG_IMAGE = `${CDN_URL}/avneesh.jpg`;
const DESCRIPTION =
  "Avneesh Rai is a Backend Engineer and AI/ML Developer specialising in scalable Python APIs, LLM pipelines, and data-intensive systems.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Avneesh Rai — Backend Engineer & AI/ML Developer",
    template: "%s | Avneesh Rai",
  },
  description: DESCRIPTION,
  applicationName: "Avneesh Rai Portfolio",
  authors: [{ name: "Avneesh Rai", url: SITE_URL }],
  keywords: [
    "Avneesh Rai",
    "Backend Engineer",
    "AI/ML Developer",
    "Python",
    "FastAPI",
    "Next.js",
    "TypeScript",
    "LLM",
    "Machine Learning",
    "Scalable APIs",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: "Avneesh Rai",
    title: "Avneesh Rai — Backend Engineer & AI/ML Developer",
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Avneesh Rai — Backend Engineer & AI/ML Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avneesh Rai — Backend Engineer & AI/ML Developer",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon512.png",
    apple: "/icon512.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Avneesh Rai",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Avneesh Rai",
      jobTitle: "Backend Engineer & AI/ML Developer",
      url: SITE_URL,
      image: OG_IMAGE,
      email: "ofc.avneesh@gmail.com",
      sameAs: [
        "https://github.com/avneeshrai07",
        "https://linkedin.com/in/avneeshrai07",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Avneesh Rai",
      description: DESCRIPTION,
      author: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon512.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <PWARegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
