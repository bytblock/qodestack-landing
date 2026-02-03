import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import ReactMarkdown from 'react-markdown'

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found - Qodestak Blog',
    }
  }

  return {
    title: `${post.title} - Qodestak Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-matte-gray">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-accent-blue hover:text-blue-400 mb-8 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Blog
            </Link>
            <div className="mb-6">
              <div className="text-accent-purple mb-4">{post.date}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-4 py-2 bg-matte-light rounded-full text-gray-300 border border-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding">
          <article className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold mt-12 mb-6 text-accent-blue">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-bold mt-8 mb-4 text-accent-purple">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 mb-6 ml-6">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300 flex items-start">
                    <span className="text-accent-blue mr-3 mt-1">•</span>
                    <span>{children}</span>
                  </li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="bg-matte-light px-2 py-1 rounded text-accent-purple font-mono text-sm">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-matte-light p-4 rounded-lg overflow-x-auto text-sm text-gray-300 font-mono border border-gray-800">
                      {children}
                    </code>
                  )
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-accent-blue pl-6 py-2 my-6 bg-matte-light rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-accent-blue hover:text-blue-400 underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-matte-gray">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Help with Your <span className="gradient-text">Project?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Let's discuss how we can help with your blockchain infrastructure or development needs.
            </p>
            <Link
              href="/#contact"
              className="inline-block bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
