import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// Usage: WP_SITE_URL=https://blogs.snehasish-chakraborty.com pnpm build
// Or set WP_SITE_URL in .env.local to sync on every build automatically.
import { wordpressSync } from './plugins/wordpress-sync'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      wordpressSync({
        siteUrl: env.WP_SITE_URL || process.env.WP_SITE_URL || '',
        force: (env.WP_FORCE_SYNC || process.env.WP_FORCE_SYNC) === 'true',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
