import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'

export const metadata = {
  title: 'Blog - Qodestak',
  description: 'Technical articles about blockchain infrastructure, full-stack development, DevOps, and Web3 technologies.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding min-h-[40vh] flex items-center bg-matte-gray">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Technical <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Insights on blockchain infrastructure, development practices, and production systems
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-matte-light rounded-xl border border-gray-800 hover:border-accent-blue transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-8">
                    <div className="text-sm text-accent-purple mb-3">
                      {post.date}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-accent-blue transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 bg-matte-gray rounded-full text-gray-300 border border-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-accent-blue font-semibold flex items-center">
                      Read More
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
