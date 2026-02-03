import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-matte-dark flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl mb-6">Case Study Not Found</h2>
          <p className="text-gray-400 mb-8">
            The case study you're looking for doesn't exist.
          </p>
          <Link
            href="/case-studies"
            className="inline-block bg-gradient-to-r from-accent-purple to-accent-blue text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
          >
            View All Case Studies
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
