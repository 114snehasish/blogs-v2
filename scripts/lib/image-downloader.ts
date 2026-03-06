/**
 * Image downloader.
 *
 * Downloads images from WordPress and saves them to public/blog-images/{slug}/.
 * Returns a map of original URL → local public path (/blog-images/...).
 */

import { createWriteStream, mkdirSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'
import { pipeline } from 'stream/promises'

const PROJECT_ROOT = new URL('../../', import.meta.url).pathname.replace(/\/$/, '')

function publicImagesDir(slug: string): string {
  return join(PROJECT_ROOT, 'public', 'blog-images', slug)
}

function localPath(slug: string, filename: string): string {
  return `/blog-images/${slug}/${filename}`
}

function filenameFromUrl(url: string): string {
  const u = new URL(url)
  return basename(u.pathname)
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  if (existsSync(destPath)) return

  const res = await fetch(url)
  if (!res.ok || !res.body) {
    console.warn(`  ⚠ Could not download ${url}: ${res.status}`)
    return
  }

  const dir = destPath.substring(0, destPath.lastIndexOf('/'))
  mkdirSync(dir, { recursive: true })

  await pipeline(res.body as unknown as NodeJS.ReadableStream, createWriteStream(destPath))
}

export interface DownloadedFeaturedImage {
  full?: string
  large?: string
  medium?: string
  mediumLarge?: string
  thumbnail?: string
}

/** Download featured media in all available sizes. Returns local public paths. */
export async function downloadFeaturedImage(
  slug: string,
  sourceUrl: string,
  sizes: Record<string, { source_url: string }> = {},
): Promise<DownloadedFeaturedImage> {
  const dir = publicImagesDir(slug)
  mkdirSync(dir, { recursive: true })

  const result: DownloadedFeaturedImage = {}

  // Download the original (full) image
  const fullFilename = filenameFromUrl(sourceUrl)
  const fullDest = join(dir, fullFilename)
  await downloadFile(sourceUrl, fullDest)
  result.full = localPath(slug, fullFilename)

  // Download each registered size
  const sizeMap: Record<string, keyof DownloadedFeaturedImage> = {
    thumbnail: 'thumbnail',
    medium: 'medium',
    medium_large: 'mediumLarge',
    large: 'large',
  }

  for (const [wpSize, field] of Object.entries(sizeMap)) {
    const sizeData = sizes[wpSize]
    if (!sizeData?.source_url) continue
    const filename = filenameFromUrl(sizeData.source_url)
    await downloadFile(sizeData.source_url, join(dir, filename))
    result[field] = localPath(slug, filename)
  }

  return result
}

/** Download an author avatar. Returns local public path or undefined on failure. */
export async function downloadAvatar(
  authorSlug: string,
  avatarUrl: string,
): Promise<string | undefined> {
  const dir = join(PROJECT_ROOT, 'public', 'blog-images', 'authors')
  mkdirSync(dir, { recursive: true })

  const ext = extname(new URL(avatarUrl).pathname) || '.jpg'
  const filename = `${authorSlug}${ext}`
  const dest = join(dir, filename)

  try {
    await downloadFile(avatarUrl, dest)
    return `/blog-images/authors/${filename}`
  } catch {
    return undefined
  }
}

/**
 * Download all images found in HTML content.
 * Returns a map of original src URL → local public path.
 */
export async function downloadContentImages(
  slug: string,
  htmlContent: string,
): Promise<Map<string, string>> {
  const dir = publicImagesDir(slug)
  mkdirSync(dir, { recursive: true })

  const urlMap = new Map<string, string>()

  // Match all src attributes in img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  let match: RegExpExecArray | null

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const originalUrl = match[1]
    if (!originalUrl || urlMap.has(originalUrl)) continue

    // Use the base filename (strip WordPress size suffixes like -300x200 for deduplication)
    const filename = filenameFromUrl(originalUrl)
    const dest = join(dir, filename)

    try {
      await downloadFile(originalUrl, dest)
      urlMap.set(originalUrl, localPath(slug, filename))
    } catch {
      console.warn(`  ⚠ Skipping content image: ${originalUrl}`)
    }
  }

  return urlMap
}
