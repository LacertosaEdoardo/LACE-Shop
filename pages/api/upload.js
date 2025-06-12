import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Crea la directory per i video se non esiste
    const uploadDir = path.join(process.cwd(), 'public/videos')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Configura formidable
    const options = {
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    }

    // Parse della richiesta
    const form = new IncomingForm(options)

    const formData = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err)
          return
        }
        resolve({ fields, files })
      })
    })

    const file = formData.files.video?.[0] || Object.values(formData.files)[0]?.[0]

    if (!file) {
      throw new Error('Nessun file caricato')
    }

    // Gestione del nome file
    const timestamp = Date.now()
    const originalFileName = file.originalFilename || 'video'
    const fileExt = path.extname(originalFileName) || '.mp4'
    const fileName = `video-${timestamp}${fileExt}`
    const finalPath = path.join(uploadDir, fileName)

    try {
      // Leggi il file temporaneo
      const fileContent = fs.readFileSync(file.filepath)
      
      // Scrivi il file nella posizione finale
      fs.writeFileSync(finalPath, fileContent)
      
      // Elimina il file temporaneo
      try {
        fs.unlinkSync(file.filepath)
      } catch (e) {
        console.warn('Errore nella pulizia del file temporaneo:', e)
      }

      // Risposta con l'URL del video
      res.status(200).json({ 
        message: 'File caricato con successo',
        videoUrl: `/videos/${fileName}`
      })
    } catch (error) {
      console.error('Errore nella gestione del file:', error)
      throw new Error('Errore nella gestione del file: ' + error.message)
    }

  } catch (error) {
    console.error('Errore durante il caricamento:', error)
    res.status(500).json({ 
      message: 'Errore durante il caricamento del file',
      error: error.message 
    })
  }
}
