export type NavItem = {
  label: string
  href: string
}

export type LinkItem = {
  label: string
  href?: string
  external?: boolean
}

export type Project = {
  id: string
  title: string
  kicker: string
  description: string
  image: string
  imageAlt: string
  repository: string
  liveUrl?: string
  actions: LinkItem[]
  technologies: string[]
  features: string[]
  meta: Array<{
    label: string
    value: string
  }>
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type ExperienceItem = {
  year: string
  role: string
  organization: string
  location?: string
  details: string[]
}

export type EducationItem = {
  year: string
  degree: string
  institution: string
  status: string
}
