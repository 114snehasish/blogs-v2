export interface Author {
  name: string
  url?: string
  avatar?: string
}

export interface SeoMeta {
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonicalUrl?: string
}

export interface ImageResolutions {
  thumbnail?: string
  medium?: string
  mediumLarge?: string
  large?: string
  full?: string
}

export interface FrontMatter {
  title: string
  date: string
  slug: string
  tags?: string[]
  description?: string
  draft?: boolean
  coverImage?: string
  coverImageResolutions?: ImageResolutions
  author?: Author
  seo?: SeoMeta
  wordpressId?: number
}

export interface BlogPost {
  frontMatter: FrontMatter
  content: string
  /** File path, e.g. "assets/posts/my-post.md" */
  path: string
}

export interface BlogPostMeta {
  frontMatter: FrontMatter
  path: string
}
