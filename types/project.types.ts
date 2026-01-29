// types/project.types.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: TechStack[];
  images: ProjectImage[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: ProjectCategory;
  createdAt: Date;
}

export type ProjectCategory = 'web' | 'api' | 'data-science' | 'devops' | 'mobile';

export interface TechStack {
  name: string;
  icon?: string;
  color?: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured' | 'compact';
  onSelect?: (project: Project) => void;
}
