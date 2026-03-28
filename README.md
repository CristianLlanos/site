# cristianllanos.com

Personal portfolio and blog built with [Next.js](https://nextjs.org) 15, React 19, and TypeScript. Statically exported and deployed on [Netlify](https://www.netlify.com).

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Custom CSS with design tokens (dark theme)
- **Markdown:** markdown-it with syntax highlighting (highlight.js)
- **Icons:** lucide-react
- **Deployment:** Netlify
- **Content:** Markdown files with YAML frontmatter

## Project Structure

```
app/
├── (home)/           # Home page (no navigation header)
├── (navigation)/     # Pages with shared navigation layout
│   ├── about/
│   ├── blog/
│   └── projects/
├── globals.css       # Design system and styles
└── layout.tsx        # Root layout with metadata and fonts

components/           # Reusable React components
content/              # Markdown blog posts, projects, and site config
lib/                  # Utilities (content loading, markdown, types)
scripts/              # CLI tools (new-post generator)
public/               # Static assets (images, icons)
```

## Development

```bash
# Install dependencies
npm install

# Start dev server at localhost:3000
npm run dev

# Build for production (static export to out/)
npm run build

# Lint
npm run lint
```

## Content

Blog posts and projects are stored as Markdown files with YAML frontmatter in `content/`.

### Creating a new post

```bash
npm run new-post
```

This interactive CLI will prompt you for the type (blog/project), title, description, and other metadata, then generate the `.md` file with the correct filename and frontmatter.

You can also create files manually. Blog posts go in `content/blog/` and projects in `content/projects/`:

```md
---
title: "My Post Title"
date: "2026-03-28T00:00:00.000Z"
description: "A short description"
image: "/img/my-image.png"
---

Your markdown content here.
```

## Deployment

Builds are triggered automatically on push via Netlify. The static output is published from the `out/` directory.
