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
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={project.images[0].src}
            alt={project.images[0].alt}
            width={project.images[0].width}
            height={project.images[0].height}
            className="object-cover transition-transform hover:scale-105"
            priority={project.featured}
          />
          
          {project.featured && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
              â­ Featured
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">
          {project.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech.name}
              className="px-3 py-1 rounded-full text-sm font-medium"
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
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {project.createdAt.toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs uppercase">
            {project.category}
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              <Github size={18} />
              Code
            </Link>
          )}
          
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ExternalLink size={18} />
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

