import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({})
    const [fields, files] = await form.parse(req)
    const videoFile = files.video?.[0]

    if (!videoFile) {
      return res.status(400).json({ error: 'No video file provided' })
    }

    // Generate a unique filename
    const uniqueFileName = `${Date.now()}-${videoFile.originalFilename}`
    const videosDir = path.join(process.cwd(), 'public', 'videos')
    
    // Create videos directory if it doesn't exist
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true })
    }

    // Move the uploaded file to the videos directory
    const newPath = path.join(videosDir, uniqueFileName)
    await fs.promises.copyFile(videoFile.filepath, newPath)
    await fs.promises.unlink(videoFile.filepath) // Clean up the temp file

    // Return the URL for the uploaded video
    res.status(200).json({
      videoUrl: `/videos/${uniqueFileName}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload video' })
  }
}
