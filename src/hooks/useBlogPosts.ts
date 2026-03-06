import { useState, useEffect } from 'react'
import { fetchContentTree, fetchFileContent } from '@/services/github'
import { parsePostMeta } from '@/lib/markdown'
import type { BlogPostMeta } from '@/types/blog'

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const tree = await fetchContentTree()
        const metas = await Promise.all(
          tree.map(async (item) => {
            const raw = await fetchFileContent(item.path)
            return parsePostMeta(item.path, raw)
          }),
        )
        // Sort by date descending, skip drafts
        const published = metas
          .filter((p) => !p.frontMatter.draft)
          .sort(
            (a, b) =>
              new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime(),
          )
        setPosts(published)
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return { posts, loading, error }
}
