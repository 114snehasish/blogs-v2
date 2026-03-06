/**
 * Local content service.
 *
 * Reads blog posts from assets/posts/*.md using Vite's import.meta.glob.
 * All files are bundled at build time — no runtime HTTP requests needed.
 *
 * Run `pnpm migrate <wordpress-url>` to populate assets/posts/ before building.
 */

import { parsePost, parsePostMeta, filePathToSlug } from '@/lib/markdown'
import type { BlogPost, BlogPostMeta } from '@/types/blog'

// Eagerly import all markdown files at build time.
// Path is relative to this file: src/services/ → ../../assets/posts/
const postFiles = import.meta.glob('../../assets/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function getAllPostMetas(): BlogPostMeta[] {
  return Object.entries(postFiles)
    .map(([path, raw]) => parsePostMeta(path, raw))
    .filter((p) => !p.frontMatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime(),
    )
}

export function getPostBySlug(slug: string): BlogPost | null {
  const entry = Object.entries(postFiles).find(([path]) => {
    const filename = filePathToSlug(path)
    const fm = parsePostMeta(path, postFiles[path]).frontMatter
    return filename === slug || fm.slug === slug
  })

  if (!entry) return null
  return parsePost(entry[0], entry[1])
}
