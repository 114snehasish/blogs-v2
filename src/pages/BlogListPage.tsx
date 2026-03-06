import { Link } from 'react-router-dom'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import './BlogListPage.css'

export function BlogListPage() {
  const { posts, loading, error } = useBlogPosts()

  if (loading) return <p className="text-muted-foreground">Loading posts…</p>
  if (error) return <p className="text-destructive">Failed to load posts: {error.message}</p>
  if (posts.length === 0) return <p className="text-muted-foreground">No posts yet.</p>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.frontMatter.slug}>
            <Link to={`/blog/${post.frontMatter.slug}`} className="group post-link">
              {(post.frontMatter.coverImageResolutions?.medium ?? post.frontMatter.coverImage) && (
                <img
                  src={post.frontMatter.coverImageResolutions?.medium ?? post.frontMatter.coverImage}
                  alt={post.frontMatter.title}
                  className="post-cover-thumb"
                />
              )}
              <h2 className="post-title">{post.frontMatter.title}</h2>
              <p className="text-sm text-muted-foreground">{post.frontMatter.date}</p>
              {post.frontMatter.description && (
                <p className="text-muted-foreground">{post.frontMatter.description}</p>
              )}
              {post.frontMatter.tags && (
                <div className="tag-list">
                  {post.frontMatter.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
