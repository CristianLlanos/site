---
name: new-article
description: Create a new blog article for cristianllanos.com
disable-model-invocation: true
argument-hint: [topic or project path]
---

# New Article Skill

Create a new blog article for cristianllanos.com. The topic is: $ARGUMENTS

## Step 1: Research the subject

If the argument is a path to a project (e.g. `~/Code/some-project`):
- Read the README, build files, and key source files to understand what the project does, its API, architecture, and design decisions.
- Read test files for real usage examples.

If the argument is a topic or idea:
- Gather context from the user about what they want to cover.

## Step 2: Study existing articles for style

Read 1-2 recent articles from `content/blog/` to match the current writing style. Key style rules:

- **Language**: Spanish
- **Tone**: Technical but conversational. Direct, no filler. Explains the "why" behind decisions.
- **Structure**: Problem statement, solution introduction, how it works, design decisions, practical examples, closing/next steps.
- **Code**: Real-world Kotlin/PHP/TypeScript examples with explanations. No toy code.
- **Audience**: Developers familiar with the tech stack. No hand-holding on basics.
- **Length**: ~1500-2500 words including code blocks.

## Step 3: Create the article file

**File location**: `content/blog/{slug}.md`
- Slug: kebab-case, no accents (NFD normalized), lowercase. E.g. "Inyección de dependencias" becomes `inyeccion-de-dependencias`.

**Frontmatter format** (YAML):
```yaml
---
title: "Article Title In Spanish"
date: "{ISO 8601 timestamp, e.g. 2026-03-28T21:00:00.000Z}"
description: "One-line Spanish description for SEO/social previews"
image: "/img/{slug}.png"
---
```

**Body**: Start with `${toc}` on the first line after frontmatter (generates automatic table of contents). Then use `##` headers for main sections and `###` for subsections.

## Step 4: Create the cover image

Create a 1200x630 PNG image at `public/img/{slug}.png`. Follow these rules:

- **Style**: Dark background (#0a0e1a to #111827 gradient), subtle grid overlay, indigo/violet accent colors (#6366f1, #8b5cf6, #a78bfa).
- **Content**: A diagram or code snippet that visually communicates the article's core concept. Not decorative — informative.
- **Typography**: `system-ui` for labels, `ui-monospace` for code. Light text (#e2e8f0) on dark. Muted secondary text (#64748b, #94a3b8).
- **Layout**: Cards/boxes with rounded corners, dashed connection lines between components, badge-style labels for types/interfaces.
- **Footer**: `cristianllanos.com` centered at bottom in muted color (#334155).

**Process**:
1. Create the image as SVG at `/tmp/{slug}.svg`
2. Validate there are no duplicate attributes in SVG elements
3. Convert to PNG: `npx sharp-cli -i /tmp/{slug}.svg -o public/img/{slug}.png resize 1200 630`
4. Verify dimensions: `sips -g pixelWidth -g pixelHeight public/img/{slug}.png`
5. Show the image for review using the Read tool

## Step 5: Review

- Read the final article file and show it for review.
- Verify the image path in frontmatter matches the actual file.
- Confirm the dev server picks it up (if running).

## Writing guidelines

- Open with a concrete problem the reader recognizes. No abstract introductions.
- Show code early. Don't explain for three paragraphs before showing what it looks like.
- When comparing approaches, use before/after code blocks.
- Design decision sections should explain what was chosen AND what was rejected and why.
- End with what's next or what was learned — not a generic summary.
- Don't add English translations or bilingual content. Everything in Spanish.
- Use em dashes (—) for parenthetical clauses, not parentheses.
- Bold key concepts on first mention only.
- Link to GitHub repos and external resources inline.
