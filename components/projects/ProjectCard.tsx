'use client';
import { ProjectCardProps } from '@/types/project.types';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Calendar } from 'lucide-react';

export default function ProjectCard({ project, variant = 'default', onSelect }: ProjectCardProps) {
  const cardStyles = {
    default: 'border border-gray-200 hover:border-blue-500',
    featured: 'border-2 border-blue-500 shadow-lg',
    compact: 'border border-gray-200',
  };

  return (
    <article
      className={`${cardStyles[variant]} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl bg-white`}
      onClick={() => onSelect?.(project)}
    >
      {/* Project Image */}
      {project.images[0] && (
        // FIX: Use a positioned wrapper so Next Image can fill it correctly.
        // aspect-video gives 16:9; `relative` + `fill` is the correct Next.js pattern.
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={project.images[0].src}
            alt={project.images[0].alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority={project.featured}
          />

          {project.featured && (
            // FIX: Replaced corrupted "â­" with the correct ⭐ character
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
              ⭐ Featured
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* FIX: Responsive font size — smaller on mobile, larger on md+ */}
        <h3 className="text-lg sm:text-2xl font-bold mb-2 text-gray-900">
          {project.title}
        </h3>

        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech.name}
              className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              style={{
                backgroundColor: `${tech.color}15`,
                color: tech.color,
              }}
            >
              {tech.icon} {tech.name}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={14} className="sm:hidden" />
            <Calendar size={16} className="hidden sm:block" />
            {project.createdAt.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs uppercase tracking-wide">
            {project.category}
          </span>
        </div>

        {/* Links */}
        {/* FIX: Stack buttons on very small screens, row on sm+ */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
            >
              <Github size={16} className="sm:hidden" />
              <Github size={18} className="hidden sm:block" />
              Code
            </Link>
          )}

          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <ExternalLink size={16} className="sm:hidden" />
              <ExternalLink size={18} className="hidden sm:block" />
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}