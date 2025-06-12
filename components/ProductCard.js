import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function ProductCard({ prodotto }) {
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          videoRef.current?.play()
        } else {
          setIsVisible(false)
          videoRef.current?.pause()
          if (videoRef.current) {
            videoRef.current.currentTime = 0
          }
        }
      })
    }, options)

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  const handleVideoError = (e) => {
    console.error('Error loading video:', e)
  }

  return (
    <a
      href={prodotto.linkVinted}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition"
      ref={containerRef}
    >
      <div className="relative h-64 overflow-hidden">
        <video
          ref={videoRef}
          src={prodotto.videoUrl}
          muted
          loop
          playsInline
          controls={false}
          onError={handleVideoError}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isVisible ? 'scale-105' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-lg font-semibold text-white truncate">{prodotto.titolo}</p>
          <p className="text-white font-medium">€{prodotto.prezzo}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-blue-600 group-hover:text-blue-700 flex items-center space-x-1">
          <span>Acquista su Vinted</span>
          <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </p>
      </div>
    </a>
  )
}