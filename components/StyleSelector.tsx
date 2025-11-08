'use client'

import { Style } from '@/app/page'
import { Check } from 'lucide-react'

interface StyleSelectorProps {
  onSelect: (style: Style) => void
  selectedStyle: Style | null
}

export default function StyleSelector({ onSelect, selectedStyle }: StyleSelectorProps) {
  const styles = [
    {
      id: 'dark-studio' as Style,
      name: 'Dark Studio',
      description: 'Professional dark studio lighting with dramatic shadows',
      preview: '🎬',
      gradient: 'from-gray-800 to-black',
    },
    {
      id: 'paris-cafe' as Style,
      name: 'Paris Café',
      description: 'Warm, cozy Parisian café atmosphere with natural lighting',
      preview: '☕',
      gradient: 'from-amber-600 to-orange-800',
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Style</h2>
      <p className="text-gray-400 mb-6">
        Choose the AI style for your photo transformation
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`relative p-6 rounded-xl border-2 transition-all text-left ${
              selectedStyle === style.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
            }`}
          >
            {selectedStyle === style.id && (
              <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="text-6xl mb-4">{style.preview}</div>
            <h3 className="text-xl font-bold mb-2">{style.name}</h3>
            <p className="text-gray-400 text-sm">{style.description}</p>
            <div
              className={`mt-4 h-2 rounded-full bg-gradient-to-r ${style.gradient}`}
            />
          </button>
        ))}
      </div>

      {selectedStyle && (
        <button
          onClick={() => onSelect(selectedStyle)}
          className="mt-6 w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Continue with {styles.find((s) => s.id === selectedStyle)?.name}
        </button>
      )}
    </div>
  )
}

