import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-bold mb-6 gradient-text">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block bg-accent-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
