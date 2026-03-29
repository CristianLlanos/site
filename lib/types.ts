export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  body: string
  image: string
  og?: string
}

export interface ProjectPost {
  slug: string
  title: string
  date: string
  description: string
  body: string
  project_type: string
  cover?: string
  gallery?: string[]
}

export interface SiteInfo {
  sitename: string
  sitedescription: string
  sitelang: string
}
