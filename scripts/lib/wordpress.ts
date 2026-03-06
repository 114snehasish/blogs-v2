/**
 * WordPress REST API client.
 *
 * Uses the /wp-json/wp/v2/posts endpoint with ?_embed=true to fetch
 * posts with author, featured media, and taxonomy terms in one request.
 */

export interface WpImageSize {
  source_url: string
  width: number
  height: number
  file?: string
}

export interface WpMediaDetails {
  sizes?: Record<string, WpImageSize>
}

export interface WpFeaturedMedia {
  source_url: string
  media_details: WpMediaDetails
}

export interface WpAuthor {
  name: string
  link: string
  avatar_urls?: Record<string, string>
}

export interface WpTerm {
  id: number
  name: string
  slug: string
  taxonomy: 'category' | 'post_tag'
}

export interface YoastHeadJson {
  title?: string
  description?: string
  og_title?: string
  og_description?: string
  og_image?: Array<{ url: string; width?: number; height?: number }>
  twitter_card?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  canonical?: string
}

export interface WpPost {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  yoast_head_json?: YoastHeadJson
  _embedded?: {
    author?: WpAuthor[]
    'wp:featuredmedia'?: WpFeaturedMedia[]
    'wp:term'?: WpTerm[][]
  }
}

export async function fetchAllPosts(siteUrl: string): Promise<WpPost[]> {
  const base = siteUrl.replace(/\/$/, '')
  const allPosts: WpPost[] = []
  let page = 1
  const perPage = 100

  console.log(`Fetching posts from ${base}/wp-json/wp/v2/posts ...`)

  while (true) {
    const url = `${base}/wp-json/wp/v2/posts?_embed=true&per_page=${perPage}&page=${page}&status=publish`
    const res = await fetch(url)

    if (res.status === 400) break // WordPress returns 400 when page exceeds total

    if (!res.ok) {
      throw new Error(`WordPress API error: ${res.status} ${res.statusText} (${url})`)
    }

    const posts = (await res.json()) as WpPost[]
    allPosts.push(...posts)
    console.log(`  Page ${page}: fetched ${posts.length} posts (total so far: ${allPosts.length})`)

    if (posts.length < perPage) break
    page++
  }

  return allPosts
}
