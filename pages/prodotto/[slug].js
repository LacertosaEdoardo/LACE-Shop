import fs from 'fs'
import path from 'path'

// Funzione per generare i paths statici
export async function getStaticPaths() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/prodotti.json'))
  )
  
  const paths = data.map(prodotto => ({
    params: { slug: prodotto.slug }
  }))

  return {
    paths,
    fallback: false
  }
}

// Funzione per ottenere i dati del prodotto
export async function getStaticProps({ params }) {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/prodotti.json'))
  )
  
  const prodotto = data.find(p => p.slug === params.slug)

  if (!prodotto) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      prodotto
    }
  }
}

// Componente della pagina prodotto
export default function PaginaProdotto({ prodotto }) {
  return (
    <div className="max-w-2xl mx-auto">
      <video
        src={prodotto.videoUrl}
        controls
        className="w-full rounded-2xl shadow-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">{prodotto.titolo}</h1>
      <p className="text-xl text-gray-700 mb-6">€{prodotto.prezzo}</p>
      <a
        href={prodotto.linkVinted}
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        Compra su Vinted
      </a>
    </div>
  )
}