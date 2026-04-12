export interface ProjectTag {
  label: string
  type: 'live' | 'type'
}

export interface ProjectFeature {
  title: string
  desc: string
}

export interface ProjectMetric {
  value: string
  label: string
  highlight: boolean
}

export interface Project {
  id: string
  num: string
  name: string
  sub: string
  tags: ProjectTag[]
  overview: string
  problem: string
  challenges: string[]
  decisions: string[]
  features: ProjectFeature[]
  stack: string[]
  metrics: ProjectMetric[]
  githubUrl: string
  demoUrl: string
  diagramType: 'sunakku' | 'velox' | 'gatekeeper'
}
