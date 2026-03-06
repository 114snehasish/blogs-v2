# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server (http://localhost:5173)
pnpm build        # TypeScript check + production build (output: dist/)
pnpm preview      # serve the production build locally
pnpm lint         # run ESLint
```

All package management uses **pnpm**. Never use npm or yarn.

To add a shadcn/ui component:
```bash
pnpm dlx shadcn@latest add <component-name>
```

## Architecture

This is a **fully static** React + Vite site that reads blog content from a **separate GitHub repository** (GitOps pattern). There is no backend, no SSR, and no CMS.

### Content Flow

```
GitHub content repo (MD/MDX files)
        │
        ▼ GitHub API (raw.githubusercontent.com)
src/services/github.ts  ← fetches file tree + raw file content
        │
        ▼
src/lib/markdown.ts     ← parses frontmatter (gray-matter) + body
        │
        ▼
src/hooks/useBlogPosts.ts / useBlogPost.ts   ← React hooks
        │
        ▼
src/pages/BlogListPage.tsx / BlogPostPage.tsx
```

Content repo is configured via environment variables (see `.env.example`). Copy it to `.env.local` to develop locally.

### Key env vars
| Variable | Purpose |
|---|---|
| `VITE_CONTENT_REPO_OWNER` | GitHub username / org |
| `VITE_CONTENT_REPO_NAME` | Repo name containing the MD files |
| `VITE_CONTENT_REPO_BRANCH` | Branch to read from (default: `main`) |
| `VITE_CONTENT_DIR` | Subdirectory for posts (default: repo root) |
| `VITE_GITHUB_TOKEN` | Optional PAT for higher rate limits |

### Blog post frontmatter schema

Every `.md` / `.mdx` file in the content repo should have YAML frontmatter matching `src/types/blog.ts`:

```yaml
---
title: "Post Title"
date: "2025-01-15"
slug: "post-slug"          # optional — defaults to filename
description: "..."         # optional
tags: [tag1, tag2]         # optional
draft: true                # optional — drafts are hidden from listing
coverImage: "url"          # optional
---
```

### Routing

`react-router-dom` with `BrowserRouter`:
- `/` → `BlogListPage` — sorted list of all published posts
- `/blog/:slug` → `BlogPostPage` — individual post rendered via `react-markdown`
- `/about` → `AboutPage`

When deploying as a static site (e.g. GitHub Pages, Netlify, Cloudflare Pages), configure the host to redirect all 404s to `index.html` so client-side routing works.

### Tech stack
- **Vite 7** + `@vitejs/plugin-react` + `@tailwindcss/vite` (Tailwind v4, CSS-based config — no `tailwind.config.js`)
- **shadcn/ui** — components live in `src/components/ui/`, add via CLI above
- **react-markdown** + `remark-gfm` + `rehype-highlight` — markdown rendering with GFM and syntax highlighting
- **gray-matter** — YAML frontmatter parsing

### Path alias

`@/` maps to `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json`.

## Styling convention

**Any element with more than 2 Tailwind utility classes must be extracted into a named CSS class in a component-level CSS file using `@apply`.**

- Every component/page that needs custom classes gets its own `.css` file alongside it (e.g. `Header.tsx` → `Header.css`).
- Import it directly in the component: `import './Header.css'`
- Name classes semantically after their role, not their appearance (e.g. `.post-title`, not `.text-xl-bold`).
- Each component CSS file must start with `@reference "../index.css"` (adjust the relative path depth) so Tailwind v4 can resolve `@apply` classes.
- Exception: Tailwind variant-modifier classes like `group` and `peer` cannot be used inside `@apply` — keep those inline in JSX and apply the rest via CSS class.

## Future: WordPress migration

The existing WordPress site is at `https://blogs.snehasish-chakraborty.com`. Migration plan: export posts as Markdown files into the content repo with correct frontmatter, matching slugs to preserve URLs.
