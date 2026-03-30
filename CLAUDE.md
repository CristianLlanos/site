# cristianllanos.com

Personal website and blog for Cristian Llanos. Static Next.js 15 site deployed on Netlify. The `master` branch autodeploys to production.

## Deploy budget

Netlify gives 300 build credits per cycle (resets on the 14th of each month). Each deploy costs 15 credits → **20 deploys per cycle**.

- **Max 4 deploys per week** to maintain a steady pace
- **Reserve 4 deploys per cycle** for urgent bug fixes
- Batch non-urgent changes on `main` and merge to `master` deliberately
- **Never push to `master` just for small or cosmetic changes** — accumulate them
- Before merging to `master`, consider how many deploys remain in the current cycle

## Commands

- `npm run dev` — local dev server
- `npm run build` — full build: RSS generation → Next.js static export → Pagefind index
- `npm run lint` — ESLint
- `npm run new-post` — interactive CLI to scaffold a new blog/project post

## Architecture

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Output**: Static export (`output: 'export'`) to `out/`, deployed on Netlify
- **Content**: Markdown files in `content/blog/` and `content/projects/`, parsed with gray-matter + markdown-it
- **Search**: Pagefind (built post-export from `out/`)
- **Comments**: Giscus (GitHub Discussions)
- **Analytics**: Google Tag Manager via `@next/third-parties`

### Route structure

```
app/
  (home)/           — Landing page (no nav bar)
  (navigation)/     — Pages with top nav bar
    blog/[slug]/    — Blog posts
    projects/       — Project list
      [slug]/       — Dynamic project pages
      kotlin-container/          — Project documentation subsite
        (guides)/                — Guide pages with sidebar layout
    credits/        — Credits page
```

### Key directories

- `components/` — Shared components (blog cards, footer, comments, theme toggle, JSON-LD)
- `lib/` — Content loading (`content.ts`), markdown rendering (`markdown.ts`), types (`types.ts`)
- `content/site/info.json` — Site metadata (name, description, language)
- `scripts/` — Build-time scripts (RSS generation, new post scaffolding)
- `public/img/og/` — OG images (1200x630), some with `.html` source templates

## Conventions

### Styling

- Single `globals.css` file with CSS custom properties (design tokens)
- BEM naming: `.block`, `.block__element`, `.block--modifier`
- Dark theme by default, light theme via `[data-theme="light"]` overrides
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- Layout max-widths: site 1100px, article 720px

### Components

- Server Components by default; `'use client'` only where needed (theme toggle, comments, guide sidebar)
- No CSS modules — all styles in `globals.css`

### Content

- Blog frontmatter: `title`, `date` (ISO 8601), `description`, `image`, optional `og`
- Project frontmatter: `title`, `date`, `description`, `project_type`, optional `cover`, `gallery`
- Blog posts support `${toc}` placeholder for auto-generated table of contents
- Most blog content is in Spanish (site lang: `es-PE`); kotlin-container guides are in English

### SEO

- Every page has `generateMetadata()` with title, description, OG image, and canonical URL
- Schema.org structured data via `<JsonLd>` component (WebSite, Person, BlogPosting, TechArticle, etc.)
- Dynamic sitemap at `app/sitemap.ts`; robots at `app/robots.ts`
- RSS feed generated at build time to `public/feed.xml`
