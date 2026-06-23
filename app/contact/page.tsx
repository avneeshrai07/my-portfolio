import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Avneesh Rai — Backend Engineer & AI/ML Developer. Open to roles and collaborations.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Avneesh Rai",
    description:
      "Get in touch with Avneesh Rai — Backend Engineer & AI/ML Developer. Open to roles and collaborations.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ContactView />
    </main>
  );
}
