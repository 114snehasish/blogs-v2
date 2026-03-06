/**
 * Vite plugin: WordPress content sync.
 *
 * Runs the WordPress scraper during Vite's buildStart hook so content is
 * always up-to-date before the production build begins.
 *
 * Usage in vite.config.ts:
 *   import { wordpressSync } from './plugins/wordpress-sync'
 *
 *   plugins: [
 *     wordpressSync({ siteUrl: process.env.WP_SITE_URL ?? '' }),
 *   ]
 *
 * Set WP_SITE_URL= env var to activate; leave empty to skip.
 * Set WP_FORCE_SYNC=true to re-scrape all posts (default: skip existing).
 */

import type { Plugin } from 'vite'
import { scrapeWordPress } from '../scripts/migrate.js'

export interface WordPressSyncOptions {
  /** WordPress site URL, e.g. https://blogs.example.com */
  siteUrl: string
  /** Re-scrape posts even if the .md file already exists. Default: false */
  force?: boolean
}

export function wordpressSync(options: WordPressSyncOptions): Plugin {
  return {
    name: 'wordpress-sync',
    apply: 'build', // only runs during `vite build`, not `vite dev`
    async buildStart() {
      if (!options.siteUrl) {
        console.log('[wordpress-sync] WP_SITE_URL not set — skipping content sync.')
        return
      }
      console.log(`[wordpress-sync] Syncing content from ${options.siteUrl} ...`)
      await scrapeWordPress(options.siteUrl, { force: options.force ?? false })
    },
  }
}
