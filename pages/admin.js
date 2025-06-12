import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LoginForm from '../components/LoginForm'

export default function Admin() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [prodotti, setProdotti] = useState([])
  const [formData, setFormData] = useState({
    slug: '',
    titolo: '',
    prezzo: '',
    videoUrl: '',
    linkVinted: ''
  })
  const [message, setMessage] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [videoPreview, setVideoPreview] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [errors, setErrors] = useState({})
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    setIsAuthenticated(isAdmin)

    // Load products from JSON file
    import('../data/prodotti.json')
      .then(module => {
        const data = module.default || []
        setProdotti(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Error loading products:', error)
        setProdotti([])
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setUploading(true)
      setMessage('Caricamento in corso...')

      // Handle video file upload
      let videoUrl = '/videos/video-prodotto.mp4'
      if (videoFile) {
        const formData = new FormData()
        formData.append('video', videoFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error('Errore nel caricamento del video')
        }

        const { videoUrl: uploadedUrl } = await uploadRes.json()
        videoUrl = uploadedUrl
      }      // Create new product
      const newProduct = {
        ...formData,
        videoUrl,
        prezzo: parseFloat(formData.prezzo)
      }

      // Add product through API
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (!productRes.ok) {
        const error = await productRes.json();
        throw new Error(error.error || 'Errore nel salvataggio del prodotto');
      }

      const savedProduct = await productRes.json()

      // Update local state with the saved product
      setProdotti(prevProdotti => [...prevProdotti, savedProduct])
      
      setMessage('Prodotto aggiunto con successo!')
      
      // Reset form
      setFormData({
        slug: '',
        titolo: '',
        prezzo: '',
        videoUrl: '',
        linkVinted: ''
      })
      setVideoFile(null)
      setVideoPreview(null)
      setShowForm(false)
      
    } catch (error) {
      setMessage('Errore: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (prodotto) => {
    if (deleteConfirm === prodotto.slug) {
      try {
        const res = await fetch('/api/deleteProduct', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: prodotto.slug })
        })

        if (!res.ok) {
          throw new Error('Errore durante l\'eliminazione')
        }

        setProdotti(prev => prev.filter(p => p.slug !== prodotto.slug))
        setMessage('Prodotto eliminato con successo')
        
      } catch (error) {
        setMessage('Errore: ' + error.message)
      }
    } else {
      setDeleteConfirm(prodotto.slug)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      // Crea URL per anteprima
      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)
    }
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'prezzo' ? parseFloat(value) || value : value
    }))

    // Pulisci l'errore quando l'utente inizia a modificare il campo
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }
  const validateForm = () => {
    const newErrors = {}
    
    // Validazione titolo
    if (!formData.titolo.trim()) {
      newErrors.titolo = 'Il titolo è obbligatorio'
    }
    
    // Validazione slug
    if (!formData.slug.trim()) {
      newErrors.slug = 'Lo slug è obbligatorio'
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = 'Lo slug può contenere solo lettere minuscole, numeri e trattini'
    }
    
    // Check if slug is unique
    if (prodotti.some(p => p.slug === formData.slug)) {
      newErrors.slug = 'Questo slug è già in uso'
    }

    // Validazione prezzo
    const price = parseFloat(formData.prezzo)
    if (isNaN(price) || price <= 0) {
      newErrors.prezzo = 'Inserisci un prezzo valido maggiore di 0'
    }

    // Validazione URL Vinted
    if (!formData.linkVinted.trim()) {
      newErrors.linkVinted = 'Il link Vinted è obbligatorio'
    } else if (!formData.linkVinted.startsWith('https://www.vinted.it/')) {
      newErrors.linkVinted = 'L\'URL deve iniziare con https://www.vinted.it/'
    }

    // Validazione video
    if (!videoFile && !videoPreview) {
      newErrors.video = 'Il video è obbligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => {
      setIsAuthenticated(true)
      localStorage.setItem('isAdmin', 'true')
    }} />
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestione Prodotti</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Errore') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-8 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {showForm ? 'Nascondi Form' : 'Aggiungi Nuovo Prodotto'}
      </button>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Aggiungi Nuovo Prodotto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="titolo" className="block text-sm font-medium text-gray-700">Titolo</label>
              <input
                type="text"
                id="titolo"
                name="titolo"
                value={formData.titolo}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.titolo && <p className="mt-1 text-sm text-red-600">{errors.titolo}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug (URL-friendly nome)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                placeholder="esempio-prodotto-1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
              <p className="mt-1 text-sm text-gray-500">Usa solo lettere minuscole, numeri e trattini. Esempio: felpa-vintage-xl</p>
            </div>

            <div>
              <label htmlFor="prezzo" className="block text-sm font-medium text-gray-700">Prezzo (€)</label>
              <input
                type="number"
                id="prezzo"
                name="prezzo"
                value={formData.prezzo}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.prezzo && <p className="mt-1 text-sm text-red-600">{errors.prezzo}</p>}
            </div>

            <div>
              <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video del Prodotto</label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleVideoChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {videoPreview && (
                <div className="mt-2">
                  <video 
                    src={videoPreview} 
                    className="w-full rounded-lg" 
                    controls 
                    muted 
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="linkVinted" className="block text-sm font-medium text-gray-700">Link Vinted</label>
              <input
                type="url"
                id="linkVinted"
                name="linkVinted"
                value={formData.linkVinted}
                onChange={handleChange}
                required
                placeholder="https://www.vinted.it/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.linkVinted && <p className="mt-1 text-sm text-red-600">{errors.linkVinted}</p>}
              <p className="mt-1 text-sm text-gray-500">Esempio: https://www.vinted.it/items/1234567-felpa-vintage</p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white 
                ${uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {uploading ? 'Caricamento in corso...' : 'Aggiungi Prodotto'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold p-6 border-b">Lista Prodotti</h2>
        <div className="divide-y">
          {prodotti.map(prodotto => (
            <div key={prodotto.slug} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <video 
                  src={prodotto.videoUrl}
                  className="w-24 h-24 object-cover rounded"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                />
                <div>
                  <h3 className="font-semibold">{prodotto.titolo}</h3>
                  <p className="text-gray-600">€{prodotto.prezzo}</p>
                  <p className="text-sm text-gray-500">Slug: {prodotto.slug}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(prodotto)}
                className={`px-4 py-2 rounded ${
                  deleteConfirm === prodotto.slug
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                }`}
              >
                {deleteConfirm === prodotto.slug ? 'Conferma' : 'Elimina'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
