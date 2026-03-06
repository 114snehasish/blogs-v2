import matter from 'gray-matter'
import type { FrontMatter, BlogPost, BlogPostMeta } from '@/types/blog'

export function parsePost(filePath: string, raw: string): BlogPost {
  const { data, content } = matter(raw)
  return {
    frontMatter: data as FrontMatter,
    content,
    path: filePath,
  }
}

export function parsePostMeta(filePath: string, raw: string): BlogPostMeta {
  const { data } = matter(raw)
  // Derive slug from filename if not set in frontmatter
  const slug = (data.slug as string | undefined) ?? filePathToSlug(filePath)
  return {
    frontMatter: { ...(data as FrontMatter), slug },
    path: filePath,
  }
}

export function filePathToSlug(filePath: string): string {
  return filePath
    .replace(/^.*\//, '') // strip directories
    .replace(/\.(md|mdx)$/, '')
}
