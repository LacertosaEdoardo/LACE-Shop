import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const filePath = path.join(process.cwd(), 'data/prodotti.json')
    const data = JSON.parse(fs.readFileSync(filePath))
    res.status(200).json(data)
  } catch (error) {
    console.error('Error reading products:', error)
    res.status(500).json({ message: 'Error reading products' })
  }
}
