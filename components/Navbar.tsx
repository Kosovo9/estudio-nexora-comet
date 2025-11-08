'use client'

import { Globe } from 'lucide-react'

interface NavbarProps {
  language: string
  onLanguageChange: (lang: 'en' | 'es') => void
}

export default function Navbar({ language, onLanguageChange }: NavbarProps) {
  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Studio Nexora Comet
          </div>
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'es' : 'en')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'Español' : 'English'}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

