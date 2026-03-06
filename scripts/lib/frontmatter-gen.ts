/**
 * Generates YAML frontmatter strings from WordPress post data + downloaded asset paths.
 */

import type { WpPost } from './wordpress.js'
import type { DownloadedFeaturedImage } from './image-downloader.js'
import { htmlToText } from './html-to-md.js'

export interface FrontmatterData {
  title: string
  date: string
  slug: string
  description?: string
  tags: string[]
  wordpressId: number
  author?: { name: string; url?: string; avatar?: string }
  coverImage?: string
  coverImageResolutions?: {
    thumbnail?: string
    medium?: string
    mediumLarge?: string
    large?: string
    full?: string
  }
  seo?: {
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterCard?: string
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
    canonicalUrl?: string
  }
}

function escapeYamlString(value: string): string {
  // Use double-quoted YAML string, escape backslashes and double quotes
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}"`
}

function yamlValue(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return escapeYamlString(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[${value.map((v) => escapeYamlString(String(v))).join(', ')}]`
  }
  if (typeof value === 'object') {
    const lines = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${pad}  ${k}: ${yamlValue(v, indent + 1)}`)
    return lines.length ? `\n${lines.join('\n')}` : ''
  }
  return String(value)
}

export function buildFrontmatter(data: FrontmatterData): string {
  const lines: string[] = ['---']

  const addField = (key: string, value: unknown) => {
    if (value === undefined || value === null) return
    if (typeof value === 'string' && value === '') return
    if (Array.isArray(value) && value.length === 0) return
    if (typeof value === 'object' && !Array.isArray(value)) {
      const str = yamlValue(value, 0)
      if (!str || str === '\n') return
      lines.push(`${key}:${str}`)
      return
    }
    lines.push(`${key}: ${yamlValue(value)}`)
  }

  addField('title', data.title)
  addField('date', data.date.substring(0, 10)) // YYYY-MM-DD
  addField('slug', data.slug)
  if (data.description) addField('description', data.description)
  if (data.tags.length > 0) addField('tags', data.tags)
  addField('wordpressId', data.wordpressId)

  if (data.author) addField('author', data.author)
  if (data.coverImage) addField('coverImage', data.coverImage)
  if (data.coverImageResolutions) addField('coverImageResolutions', data.coverImageResolutions)
  if (data.seo) addField('seo', data.seo)

  lines.push('---')
  return lines.join('\n')
}

export function extractFrontmatterData(
  post: WpPost,
  featuredImage?: DownloadedFeaturedImage,
  authorAvatar?: string,
): FrontmatterData {
  const embedded = post._embedded ?? {}
  const wpAuthor = embedded.author?.[0]
  const yoast = post.yoast_head_json

  // Collect tags (taxonomy = post_tag)
  const tags: string[] = []
  for (const termGroup of embedded['wp:term'] ?? []) {
    for (const term of termGroup) {
      if (term.taxonomy === 'post_tag') tags.push(term.name)
    }
  }

  const author = wpAuthor
    ? {
        name: wpAuthor.name,
        url: wpAuthor.link || undefined,
        avatar: authorAvatar ?? (wpAuthor.avatar_urls?.['96'] ? undefined : undefined),
      }
    : undefined

  const seo =
    yoast
      ? {
          ogTitle: yoast.og_title ?? yoast.title,
          ogDescription: yoast.og_description ?? yoast.description,
          ogImage: yoast.og_image?.[0]?.url,
          twitterCard: yoast.twitter_card,
          twitterTitle: yoast.twitter_title,
          twitterDescription: yoast.twitter_description,
          twitterImage: yoast.twitter_image,
          canonicalUrl: yoast.canonical,
        }
      : undefined

  // Clean up seo object — remove undefined-only objects
  const cleanSeo =
    seo && Object.values(seo).some((v) => v !== undefined) ? seo : undefined

  return {
    title: post.title.rendered
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"'),
    date: post.date,
    slug: post.slug,
    description: post.excerpt.rendered ? htmlToText(post.excerpt.rendered) : undefined,
    tags,
    wordpressId: post.id,
    author,
    coverImage: featuredImage?.full,
    coverImageResolutions: featuredImage
      ? {
          thumbnail: featuredImage.thumbnail,
          medium: featuredImage.medium,
          mediumLarge: featuredImage.mediumLarge,
          large: featuredImage.large,
          full: featuredImage.full,
        }
      : undefined,
    seo: cleanSeo,
  }
}
