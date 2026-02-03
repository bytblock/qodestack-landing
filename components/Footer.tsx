export default function Footer() {
  return (
    <footer className="bg-matte-black border-t border-gray-800 py-8 px-6">
      <div className="max-w-7xl mx-auto text-center text-gray-400">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Qodestack. All rights reserved.
        </p>
        <p className="text-sm">
          <a href="mailto:hello@qodestack.com" className="hover:text-accent-blue transition-colors">
            hello@qodestack.com
          </a>
        </p>
      </div>
    </footer>
  )
}
