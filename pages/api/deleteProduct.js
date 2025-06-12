import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug } = req.body
    const productsPath = path.join(process.cwd(), 'data', 'prodotti.json')

    // Read current products
    const currentProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    const products = Array.isArray(currentProducts) ? currentProducts : []

    // Find product to delete
    const productIndex = products.findIndex(p => p.slug === slug)
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Remove product from array
    products.splice(productIndex, 1)

    // Save updated array
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8')

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
