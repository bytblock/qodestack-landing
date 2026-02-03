import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://qodestak.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Get blog posts
  const blogDir = path.join(process.cwd(), 'content/blog')
  let blogPosts: MetadataRoute.Sitemap = []

  try {
    const files = fs.readdirSync(blogDir)
    blogPosts = files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        url: `${baseUrl}/blog/${file.replace(/\.md$/, '')}`,
        lastModified: fs.statSync(path.join(blogDir, file)).mtime,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
  } catch (error) {
    console.error('Error reading blog directory:', error)
  }

  // Get case studies
  const caseStudiesDir = path.join(process.cwd(), 'content/case-studies')
  let caseStudies: MetadataRoute.Sitemap = []

  try {
    const files = fs.readdirSync(caseStudiesDir)
    caseStudies = files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        url: `${baseUrl}/case-studies/${file.replace(/\.md$/, '')}`,
        lastModified: fs.statSync(path.join(caseStudiesDir, file)).mtime,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
  } catch (error) {
    console.error('Error reading case studies directory:', error)
  }

  return [...staticPages, ...blogPosts, ...caseStudies]
}
