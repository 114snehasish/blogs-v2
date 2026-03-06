import { getPostBySlug } from '@/services/local'
import type { BlogPost } from '@/types/blog'

export function useBlogPost(slug: string): { post: BlogPost | null; loading: false; error: Error | null } {
  const post = getPostBySlug(slug)
  return { post, loading: false, error: null }
}
