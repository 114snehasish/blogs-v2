export interface FrontMatter {
  title: string
  date: string
  slug: string
  tags?: string[]
  description?: string
  draft?: boolean
  coverImage?: string
}

export interface BlogPost {
  frontMatter: FrontMatter
  content: string
  /** Raw file path in the content repo, e.g. "posts/my-post.md" */
  path: string
}

export interface BlogPostMeta {
  frontMatter: FrontMatter
  path: string
}
