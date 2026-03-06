/**
 * HTML → Markdown conversion using turndown + GFM plugin.
 *
 * Also rewrites image src URLs using a provided URL map before converting,
 * so downloaded local paths are used in the output Markdown.
 */

import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

function createConverter(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    hr: '---',
  })
  td.use(gfm)

  // Preserve code block language from WordPress Gutenberg HTML:
  // <pre class="wp-block-code language-java"><code>...</code></pre>
  // Turndown (and GFM plugin) ignore the language-* class by default.
  // Rules added after td.use(gfm) take priority (last-registered wins).
  td.addRule('codeBlock', {
    filter: 'pre',
    replacement(_content, node) {
      const el = node as { className?: string; textContent?: string }
      const classes = el.className ?? ''
      const match = classes.match(/\blanguage-(\S+)/)
      const lang = match ? match[1] : ''
      const code = (el.textContent ?? '').trim()
      return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`
    },
  })

  // Preserve figure/figcaption as image with alt text
  td.addRule('figure', {
    filter: 'figure',
    replacement(content) {
      return `\n\n${content.trim()}\n\n`
    },
  })

  // Strip WordPress-specific classes/wrappers that add noise
  td.addRule('wpBlock', {
    filter: (node) => {
      const el = node as { nodeName: string; className?: string }
      return (
        el.nodeName === 'DIV' &&
        !!(el.className?.includes('wp-block') || el.className?.includes('sharedaddy'))
      )
    },
    replacement(content) {
      return content ? `\n\n${content.trim()}\n\n` : ''
    },
  })

  return td
}

/**
 * Rewrite image src URLs in HTML using the provided map before converting.
 */
function rewriteImageUrls(html: string, urlMap: Map<string, string>): string {
  if (urlMap.size === 0) return html

  return html.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (match, pre, src, post) => {
    const localSrc = urlMap.get(src)
    return localSrc ? `<img${pre}src="${localSrc}"${post}>` : match
  })
}

/**
 * Strip HTML tags and decode entities — used for plain-text excerpt.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    // Decode numeric entities: &#8217; &#x2019; etc.
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    // Decode common named entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Convert WordPress post HTML to Markdown.
 * @param html - Raw HTML from WP REST API content.rendered
 * @param imageUrlMap - Map of original URL → local path (from image-downloader)
 */
export function htmlToMarkdown(html: string, imageUrlMap: Map<string, string> = new Map()): string {
  const rewritten = rewriteImageUrls(html, imageUrlMap)
  const td = createConverter()
  return td.turndown(rewritten)
}
