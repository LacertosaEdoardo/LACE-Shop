import fs from 'fs'
import path from 'path'
import ProductCard from '../components/ProductCard'

export async function getStaticProps() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/prodotti.json'))
  )
  return { props: { prodotti: data } }
}

export default function Home({ prodotti }) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-6">LACE Shop</h1>
        <p className="text-xl text-gray-600 mb-8">
          Il tuo negozio di abbigliamento vintage sostenibile
        </p>
      </section>

      {/* Come Lavoriamo Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Come Lavoriamo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-3">Selezione Accurata</h3>
            <p className="text-gray-600">
              Selezioniamo personalmente ogni capo per garantire la massima qualità
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">♻️</div>
            <h3 className="text-xl font-semibold mb-3">Sostenibilità</h3>
            <p className="text-gray-600">
              Diamo nuova vita a capi vintage di qualità
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="text-xl font-semibold mb-3">Autenticità</h3>
            <p className="text-gray-600">
              Garantiamo l'autenticità di tutti i nostri prodotti
            </p>
          </div>
        </div>
      </section>

      {/* Il Nostro Impegno Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Il Nostro Impegno</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-600 mb-6">
            In LACE Shop crediamo nella moda sostenibile. Ogni capo che selezioniamo ha una storia da raccontare e merita una seconda vita. Il nostro obiettivo è rendere la moda vintage accessibile a tutti, mantenendo prezzi equi e garantendo la massima qualità.
          </p>
          <p className="text-lg text-gray-600">
            Attraverso Vinted, offriamo un'esperienza di acquisto sicura e trasparente, dove puoi vedere dettagli e video di ogni capo prima dell'acquisto.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center mb-16">
        <a
          href="/catalogo"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
        >
          Scopri il Catalogo
        </a>
      </section>
    </div>
  )
}