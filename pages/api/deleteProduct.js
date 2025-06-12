import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { slug, videoUrl } = req.body
    const filePath = path.join(process.cwd(), 'data/prodotti.json')
    const data = JSON.parse(fs.readFileSync(filePath))

    // Rimuovi il prodotto dall'array
    const updatedProducts = data.filter(product => product.slug !== slug)

    // Salva il file JSON aggiornato
    fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2))

    // Elimina il file video se esiste
    if (videoUrl) {
      const videoPath = path.join(process.cwd(), 'public', videoUrl)
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath)
      }
    }

    res.status(200).json({ message: 'Prodotto eliminato con successo' })
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error)
    res.status(500).json({ message: 'Errore durante l\'eliminazione del prodotto' })
  }
}
