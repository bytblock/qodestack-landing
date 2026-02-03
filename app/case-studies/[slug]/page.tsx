import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Metadata } from 'next'

const caseStudiesDirectory = path.join(process.cwd(), 'content/case-studies')

function getCaseStudy(slug: string) {
  try {
    const fullPath = path.join(caseStudiesDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      ...data
    }
  } catch (error) {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const files = fs.readdirSync(caseStudiesDirectory)
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        slug: file.replace(/\.md$/, '')
      }))
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    }
  }

  return {
    title: `${caseStudy.title} | Case Studies | Qodestack`,
    description: caseStudy.excerpt || caseStudy.challenge,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.excerpt || caseStudy.challenge,
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-matte-dark">
        <article className="section-padding pt-32">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link href="/case-studies" className="text-accent-blue hover:underline">
                ← Back to Case Studies
              </Link>
            </div>

            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-accent-purple px-3 py-1 bg-matte-gray rounded-full">
                  {caseStudy.category}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{caseStudy.client}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {caseStudy.title}
              </h1>

              <p className="text-xl text-gray-400 mb-8">
                {caseStudy.excerpt}
              </p>

              {/* Tech Stack Tags */}
              {caseStudy.tags && (
                <div className="flex flex-wrap gap-2">
                  {caseStudy.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1 bg-matte-light border border-gray-800 rounded-full text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold mt-12 mb-6 text-white">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-bold mt-8 mb-4 text-white">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-300 leading-relaxed mb-6">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-300">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-300">{children}</li>
                  ),
                  code: ({ children }) => (
                    <code className="bg-matte-light px-2 py-1 rounded text-accent-blue text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-matte-light p-4 rounded-lg overflow-x-auto mb-6 border border-gray-800">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent-purple pl-4 italic text-gray-400 my-6">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-accent-blue hover:underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {caseStudy.content}
              </ReactMarkdown>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-xl border border-accent-purple/30">
              <h3 className="text-2xl font-bold mb-3">
                Interested in Similar Results?
              </h3>
              <p className="text-gray-400 mb-6">
                Let's discuss how we can help you achieve your technical goals.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-gradient-to-r from-accent-purple to-accent-blue text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
