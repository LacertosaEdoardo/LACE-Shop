import fs from 'fs'
import path from 'path'
import ProductCard from '../components/ProductCard'

export async function getStaticProps() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/prodotti.json'))
  )
  return { props: { prodotti: data } }
}

export default function Catalogo({ prodotti }) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Catalogo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {prodotti.map(p => (
          <ProductCard key={p.slug} prodotto={p} />
        ))}
      </div>
    </div>
  )
}
