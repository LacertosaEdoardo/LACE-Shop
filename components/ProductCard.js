import Link from 'next/link'
import { useState } from 'react'

export default function ProductCard({ prodotto }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={prodotto.linkVinted}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <video
          src={prodotto.videoUrl}
          muted
          loop
          playsInline
          autoPlay={isHovered}
          controls={false}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => {
            e.target.pause()
            e.target.currentTime = 0
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{prodotto.titolo}</h3>
        <p className="mt-1 text-sm text-blue-600 group-hover:text-blue-700">
          Acquista su Vinted &rarr;
        </p>
      </div>
    </a>
  )
}