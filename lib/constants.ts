import { Project, TechStack } from '@/types/project.types';

export const TECH_STACK: Record<string, TechStack> = {
  PYTHON: { name: 'Python', icon: '🐍', color: '#3776AB' },
  TYPESCRIPT: { name: 'TypeScript', icon: '📘', color: '#3178C6' },
  NEXTJS: { name: 'Next.js', icon: '⚡', color: '#000000' },
  REACT: { name: 'React', icon: '⚛️', color: '#61DAFB' },
  FASTAPI: { name: 'FastAPI', icon: '🚀', color: '#009688' },
  POSTGRES: { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
  DOCKER: { name: 'Docker', icon: '🐳', color: '#2496ED' },
  TAILWIND: { name: 'Tailwind CSS', icon: '🎨', color: '#06B6D4' },
  PANDAS: { name: 'Pandas', icon: '🐼', color: '#150458' },
  DJANGO: { name: 'Django', icon: '🎸', color: '#092E20' },
} as const;

export const PROJECTS: Project[] = [
  {
    id: 'portfolio-pwa',
    title: 'Portfolio PWA with Next.js',
    description: 'TypeScript-powered progressive web app with offline support and modern UI',
    longDescription: 'Built with Next.js 16, TypeScript, and Tailwind CSS. Features include offline functionality, installable PWA, responsive design, and optimized performance.',
    technologies: [TECH_STACK.NEXTJS, TECH_STACK.TYPESCRIPT, TECH_STACK.TAILWIND, TECH_STACK.REACT],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop',
        alt: 'Portfolio Screenshot - Modern coding workspace',
        width: 1920,
        height: 1080,
      },
    ],
    liveUrl: 'https://yourportfolio.com',
    featured: true,
    category: 'web',
    createdAt: new Date('2026-01-30'),
  },
  {
    id: 'api-backend',
    title: 'High-Performance API Backend',
    description: 'RESTful API built with FastAPI, handling 10K+ requests/second with Redis caching',
    longDescription: 'Production-grade API with JWT authentication, rate limiting, PostgreSQL database, Redis caching, and Docker deployment.',
    technologies: [TECH_STACK.PYTHON, TECH_STACK.FASTAPI, TECH_STACK.POSTGRES, TECH_STACK.DOCKER],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop',
        alt: 'API Backend Architecture',
        width: 1200,
        height: 675,
      },
    ],
    githubUrl: 'https://github.com/yourusername/api-backend',
    featured: true,
    category: 'api',
    createdAt: new Date('2025-12-15'),
  },
  {
    id: 'data-pipeline',
    title: 'ETL Data Pipeline',
    description: 'Automated data processing pipeline handling 1M+ records daily',
    longDescription: 'Scalable data pipeline built with Python, Pandas, and PostgreSQL for processing and analyzing large datasets.',
    technologies: [TECH_STACK.PYTHON, TECH_STACK.PANDAS, TECH_STACK.POSTGRES],
    images: [
      {
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop',
        alt: 'Data Pipeline Dashboard',
        width: 1200,
        height: 675,
      },
    ],
    githubUrl: 'https://github.com/yourusername/data-pipeline',
    featured: false,
    category: 'data-science',
    createdAt: new Date('2025-10-20'),
  },
];
