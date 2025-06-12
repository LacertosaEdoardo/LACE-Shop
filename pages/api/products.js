import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const productsPath = path.join(process.cwd(), 'data', 'prodotti.json')

  try {
    // Ensure file exists with valid array
    if (!fs.existsSync(productsPath)) {
      fs.writeFileSync(productsPath, '[]', 'utf8')
    }

    // Read current products array
    let products = []
    const fileContents = fs.readFileSync(productsPath, 'utf8')
    try {
      products = JSON.parse(fileContents)
      if (!Array.isArray(products)) {
        products = []
      }
    } catch (error) {
      console.error('Error parsing products file:', error)
      products = []
    }

    if (req.method === 'GET') {
      return res.status(200).json(products)
    } 
    
    if (req.method === 'POST') {
      const newProduct = req.body
      
      // Validate new product
      if (!newProduct || !newProduct.slug || !newProduct.titolo || 
          typeof newProduct.prezzo !== 'number' || !newProduct.linkVinted) {
        return res.status(400).json({ error: 'Dati del prodotto non validi' })
      }

      // Check for duplicate slug
      if (products.some(p => p.slug === newProduct.slug)) {
        return res.status(400).json({ error: 'Esiste già un prodotto con questo slug' })
      }

      // Add new product to array      // Add new product to array
      products.push(newProduct)
      
      // Save the updated array back to the file
      try {
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8')
        return res.status(200).json(newProduct)
      } catch (error) {
        console.error('Error saving products file:', error)
        return res.status(500).json({ error: 'Errore nel salvataggio del prodotto' })
      }
    }

    return res.status(405).json({ error: 'Metodo non consentito' })
  } catch (error) {
    console.error('Error handling products:', error)
    return res.status(500).json({ error: 'Errore del server' })
  }
}
