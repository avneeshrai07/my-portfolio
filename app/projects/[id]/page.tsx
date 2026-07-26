import { notFound } from 'next/navigation'
import type { Project } from '@/types/projects'
import { projects } from '@/types/projects'
import ProjectCase from '@/components/projects/ProjectPage/ProjectCase'


export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }))
}

const SITE_URL = "https://avneeshrai.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)
  if (!project) return {}

  const projectUrl = `${SITE_URL}/projects/${id}`;
  const ogImage = project.image
    ? [{ url: project.image, alt: project.name }]
    : undefined;

  return {
    title: `${project.name} — Avneesh Rai's Projects`,
    description: project.sub,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      type: "article",
      url: projectUrl,
      title: `${project.name} — Avneesh Rai's Projects`,
      description: project.sub,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${project.name} — Avneesh Rai's Projects`,
      description: project.sub,
      images: ogImage?.map((i) => i.url),
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)
  if (!project) notFound()

  const p    = project as Project
  const idx  = projects.findIndex((x) => x.id === p.id)
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]

  return (
    <main className="min-h-screen w-full" style={{ background: 'var(--proj-cream)' }}>
      <ProjectCase project={p} prev={prev} next={next} />
    </main>
  )
}