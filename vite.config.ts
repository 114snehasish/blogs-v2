import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// TODO: Uncomment once full migration is complete. Set WP_SITE_URL env var to activate.
// Usage: WP_SITE_URL=https://blogs.snehasish-chakraborty.com pnpm build
// import { wordpressSync } from './plugins/wordpress-sync'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // TODO: Uncomment and set WP_SITE_URL + WP_FORCE_SYNC env vars to enable auto-sync on build.
    // wordpressSync({
    //   siteUrl: process.env.WP_SITE_URL ?? '',
    //   force: process.env.WP_FORCE_SYNC === 'true',
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
