import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve))
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const type = await ask('Type (blog/project): ')
  if (type !== 'blog' && type !== 'project') {
    console.error('Invalid type. Use "blog" or "project".')
    process.exit(1)
  }

  const title = await ask('Title: ')
  const description = await ask('Description: ')

  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const datePrefix = `${yyyy}-${mm}-${dd}`
  const slug = slugify(title)

  if (type === 'blog') {
    const image = await ask('Image path (e.g. /img/my-image.png): ')
    const filename = `${datePrefix}-${slug}.md`
    const filePath = path.join(process.cwd(), 'content', 'blog', filename)

    const content = `---
title: "${title}"
date: "${now.toISOString()}"
description: "${description}"
image: "${image}"
---

Write your article here.
`
    fs.writeFileSync(filePath, content)
    console.log(`\nCreated: content/blog/${filename}`)
  } else {
    const projectType = await ask('Project type (story/photo): ')
    const cover = await ask('Cover image path (optional, press Enter to skip): ')
    const filename = `${projectType}-${slug}.md`
    const filePath = path.join(process.cwd(), 'content', 'projects', filename)

    const frontmatter: Record<string, string> = {
      title: `"${title}"`,
      date: `"${now.toISOString()}"`,
      description: `"${description}"`,
      project_type: `"${projectType}"`,
    }
    if (cover) {
      frontmatter.cover = `"${cover}"`
    }

    const lines = Object.entries(frontmatter)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')

    const content = `---
${lines}
---

Write your project content here.
`
    fs.writeFileSync(filePath, content)
    console.log(`\nCreated: content/projects/${filename}`)
  }

  rl.close()
}

main()
