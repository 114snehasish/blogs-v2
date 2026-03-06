/**
 * GitHub content service.
 *
 * Reads markdown files from a public GitHub repository via the GitHub API.
 * Configure the content repo via environment variables:
 *   VITE_CONTENT_REPO_OWNER  e.g. "snehasish-chakraborty"
 *   VITE_CONTENT_REPO_NAME   e.g. "blog-content"
 *   VITE_CONTENT_REPO_BRANCH e.g. "main" (default)
 *   VITE_CONTENT_DIR         e.g. "posts" (default: root)
 *   VITE_GITHUB_TOKEN        optional, for higher rate limits
 */

const OWNER = import.meta.env.VITE_CONTENT_REPO_OWNER as string
const REPO = import.meta.env.VITE_CONTENT_REPO_NAME as string
const BRANCH = (import.meta.env.VITE_CONTENT_REPO_BRANCH as string) || 'main'
const CONTENT_DIR = (import.meta.env.VITE_CONTENT_DIR as string) || ''
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

const BASE = 'https://api.github.com'

function headers(): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  }
}

export interface GitHubTreeItem {
  path: string
  type: 'blob' | 'tree'
  sha: string
  url: string
}

/** Returns all .md/.mdx file paths in the content directory. */
export async function fetchContentTree(): Promise<GitHubTreeItem[]> {
  const url = `${BASE}/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  const data = (await res.json()) as { tree: GitHubTreeItem[] }
  return data.tree.filter(
    (item) =>
      item.type === 'blob' &&
      (item.path.endsWith('.md') || item.path.endsWith('.mdx')) &&
      (CONTENT_DIR === '' || item.path.startsWith(CONTENT_DIR + '/')),
  )
}

/** Returns the raw markdown string for a given file path. */
export async function fetchFileContent(filePath: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${filePath}`
  const res = await fetch(url, { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} })
  if (!res.ok) throw new Error(`Failed to fetch ${filePath}: ${res.status}`)
  return res.text()
}
