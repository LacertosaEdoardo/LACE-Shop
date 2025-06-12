import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">LACE Shop</Link>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link href="/catalogo" className="hover:text-blue-600">Catalogo</Link></li>
            <li><Link href="/admin" className="hover:text-blue-600">Admin</Link></li>
            <li><Link href="/#contact" className="hover:text-blue-600">Contatti</Link></li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="bg-white border-t">
        <div id="contact" className="max-w-5xl mx-auto px-6 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Contattaci</h2>
          <p className="text-gray-600 mb-4">
            Hai domande sui nostri prodotti? Contattaci sui social!
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">Instagram</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Facebook</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}