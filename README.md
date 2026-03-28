# cristianllanos.com

Personal portfolio and blog built with [Next.js](https://nextjs.org) 15, React 19, and TypeScript. Statically exported and deployed on [Netlify](https://www.netlify.com).

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Custom CSS with design tokens (dark theme)
- **Markdown:** markdown-it with syntax highlighting (highlight.js)
- **Icons:** lucide-react
- **Deployment:** Netlify
- **CMS:** Netlify CMS (for content editing)

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
content/              # JSON blog posts, projects, and site config
lib/                  # Utilities (content loading, markdown, types)
public/               # Static assets (images, icons, admin)
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

Blog posts and projects are stored as JSON files in `content/`. Each file contains metadata (title, date, description, image) and a markdown body.

## Deployment

Builds are triggered automatically on push via Netlify. The static output is published from the `out/` directory.
