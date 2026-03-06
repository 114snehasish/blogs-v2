import { getAllPostMetas } from '@/services/local'
import type { BlogPostMeta } from '@/types/blog'

export function useBlogPosts(): { posts: BlogPostMeta[]; loading: false; error: Error | null } {
  const posts = getAllPostMetas()
  return { posts, loading: false, error: null }
}
