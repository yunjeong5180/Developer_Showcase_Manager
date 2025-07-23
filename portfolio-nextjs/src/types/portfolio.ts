export interface Project {
  id: string
  title: string
  description: string
  category: string[]
  tech_stack: string[]
  features: string[]
  demo_url?: string
  github_url?: string
  image_url?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  name: string
  email: string
  bio: string
  skills: string[]
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  created_at: string
  updated_at: string
}