import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  content: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags || [],
        content,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags || [],
      content,
    }
  } catch {
    return null
  }
}
