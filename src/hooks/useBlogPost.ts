import { useState, useEffect } from 'react'
import { fetchContentTree, fetchFileContent } from '@/services/github'
import { parsePost, filePathToSlug } from '@/lib/markdown'
import type { BlogPost } from '@/types/blog'

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const tree = await fetchContentTree()
        const item = tree.find((t) => {
          const s = (t.path.split('/').pop() ?? '').replace(/\.(md|mdx)$/, '')
          return s === slug || filePathToSlug(t.path) === slug
        })
        if (!item) throw new Error(`Post not found: ${slug}`)
        const raw = await fetchFileContent(item.path)
        setPost(parsePost(item.path, raw))
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [slug])

  return { post, loading, error }
}
