import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useBlogPost } from '@/hooks/useBlogPost'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { post, loading, error } = useBlogPost(slug ?? '')

  if (loading) return <p className="text-muted-foreground">Loading…</p>
  if (error) return <p className="text-destructive">Failed to load post: {error.message}</p>
  if (!post) return <p className="text-muted-foreground">Post not found.</p>

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{post.frontMatter.title}</h1>
        <p className="text-sm text-muted-foreground">{post.frontMatter.date}</p>
        {post.frontMatter.tags && (
          <div className="flex gap-2 flex-wrap">
            {post.frontMatter.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {post.content}
        </ReactMarkdown>
      </div>
      <footer>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to all posts
        </Link>
      </footer>
    </article>
  )
}
