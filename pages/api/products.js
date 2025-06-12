import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  // Check if user is authenticated
  if (!req.cookies.isAdmin) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const filePath = path.join(process.cwd(), 'data/prodotti.json')
    const fileData = fs.readFileSync(filePath)
    const products = JSON.parse(fileData)

    // Add new product
    const newProduct = req.body
    products.push(newProduct)

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2))

    res.status(200).json({ message: 'Prodotto aggiunto con successo' })
  } catch (error) {
    console.error('Error adding product:', error)
    res.status(500).json({ message: 'Errore durante l\'aggiunta del prodotto' })
  }
}
