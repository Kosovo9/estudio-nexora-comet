'use client'

interface HeroProps {
  language: string
}

export default function Hero({ language }: HeroProps) {
  return (
    <div>
      <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {language === 'en' ? 'Studio Nexora Comet' : 'Studio Nexora Comet'}
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-2">
        {language === 'en' ? 'AI-Powered Photo Studio' : 'Estudio de Fotos con IA'}
      </p>
      <p className="text-gray-400 max-w-2xl mx-auto">
        {language === 'en'
          ? 'Transform your photos with AI. Professional editing, marketplace, and affiliate network.'
          : 'Transforma tus fotos con IA. Edición profesional, marketplace y red de afiliados.'}
      </p>
    </div>
  )
}


