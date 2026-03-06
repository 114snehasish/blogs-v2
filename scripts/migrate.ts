/**
 * WordPress → Markdown migration script.
 *
 * Usage:
 *   pnpm migrate <wordpress-site-url> [--force] [--slug=<post-slug>]
 *
 * Options:
 *   --force          Re-scrape posts even if the .md file already exists
 *   --slug=<slug>    Migrate only the post with the given slug
 *
 * Output:
 *   assets/posts/{slug}.md       Markdown files with YAML frontmatter
 *   public/blog-images/{slug}/   Downloaded images (all WP sizes)
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fetchAllPosts } from './lib/wordpress.js'
import {
  downloadFeaturedImage,
  downloadAvatar,
  downloadContentImages,
} from './lib/image-downloader.js'
import { htmlToMarkdown } from './lib/html-to-md.js'
import { buildFrontmatter, extractFrontmatterData } from './lib/frontmatter-gen.js'

const PROJECT_ROOT = new URL('../', import.meta.url).pathname.replace(/\/$/, '')
const POSTS_DIR = join(PROJECT_ROOT, 'assets', 'posts')

function parseArgs(argv: string[]): { siteUrl: string; force: boolean; slug?: string } {
  const args = argv.slice(2)
  const siteUrl = args.find((a) => !a.startsWith('--')) ?? ''
  const force = args.includes('--force')
  const slugArg = args.find((a) => a.startsWith('--slug='))
  const slug = slugArg ? slugArg.split('=')[1] : undefined

  if (!siteUrl) {
    console.error('Usage: pnpm migrate <wordpress-site-url> [--force] [--slug=<slug>]')
    process.exit(1)
  }

  return { siteUrl, force, slug }
}

export async function scrapeWordPress(
  siteUrl: string,
  options: { force?: boolean; slug?: string } = {},
): Promise<void> {
  const { force = false, slug: filterSlug } = options

  mkdirSync(POSTS_DIR, { recursive: true })

  const allPosts = await fetchAllPosts(siteUrl)
  const posts = filterSlug ? allPosts.filter((p) => p.slug === filterSlug) : allPosts

  if (filterSlug && posts.length === 0) {
    console.error(`No post found with slug: ${filterSlug}`)
    process.exit(1)
  }

  console.log(`\nProcessing ${posts.length} post(s)...\n`)

  for (const post of posts) {
    const outputPath = join(POSTS_DIR, `${post.slug}.md`)

    if (!force && existsSync(outputPath)) {
      console.log(`  ⏭ Skipping "${post.slug}" (already exists, use --force to re-scrape)`)
      continue
    }

    console.log(`  ↓ Migrating: ${post.slug}`)

    // 1. Download featured image
    const featuredMediaArr = post._embedded?.['wp:featuredmedia']
    const featuredMedia = featuredMediaArr?.[0]
    let featuredImage = undefined
    if (featuredMedia?.source_url) {
      featuredImage = await downloadFeaturedImage(
        post.slug,
        featuredMedia.source_url,
        featuredMedia.media_details?.sizes ?? {},
      )
    }

    // 2. Download author avatar
    const wpAuthor = post._embedded?.author?.[0]
    let authorAvatar: string | undefined
    if (wpAuthor) {
      const avatarUrl = wpAuthor.avatar_urls?.['96'] ?? wpAuthor.avatar_urls?.['48']
      if (avatarUrl && !avatarUrl.includes('gravatar.com/avatar/00000000')) {
        const authorSlug =
          wpAuthor.link ? wpAuthor.link.replace(/\/$/, '').split('/').pop() ?? 'author' : 'author'
        authorAvatar = await downloadAvatar(authorSlug, avatarUrl)
      }
    }

    // 3. Download content images and get URL map
    const imageUrlMap = await downloadContentImages(post.slug, post.content.rendered)

    // 4. Convert HTML → Markdown (with image URL rewriting)
    const markdownContent = htmlToMarkdown(post.content.rendered, imageUrlMap)

    // 5. Build frontmatter
    const fmData = extractFrontmatterData(post, featuredImage, authorAvatar)
    const frontmatter = buildFrontmatter(fmData)

    // 6. Write .md file
    const fileContent = `${frontmatter}\n\n${markdownContent}\n`
    writeFileSync(outputPath, fileContent, 'utf-8')
    console.log(`    ✓ Written: assets/posts/${post.slug}.md`)
  }

  console.log('\n✅ Migration complete.')
}

// CLI entry point
const { siteUrl, force, slug } = parseArgs(process.argv)
await scrapeWordPress(siteUrl, { force, slug })
