'use client'

import { Style } from '@/app/page'
import { Check } from 'lucide-react'
import { type Language, getTexts } from '@/lib/i18n'

interface StyleSelectorProps {
  onSelect: (style: Style) => void
  selectedStyle: Style | null
  language?: Language
}

export default function StyleSelector({ onSelect, selectedStyle, language }: StyleSelectorProps) {
  const texts = getTexts(language)
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
      <h2 className="text-2xl font-bold mb-4">{texts.selectStyle}</h2>
      <p className="text-gray-400 mb-6">
        {language === 'es'
          ? 'Elige el estilo de IA para tu transformación de foto'
          : 'Choose the AI style for your photo transformation'}
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
            <h3 className="text-xl font-bold mb-2">
              {style.id === 'dark-studio' ? texts.darkStudio : texts.parisCafe}
            </h3>
            <p className="text-gray-400 text-sm">
              {style.id === 'dark-studio'
                ? (language === 'es'
                    ? 'Iluminación de estudio oscuro profesional con sombras dramáticas'
                    : 'Professional dark studio lighting with dramatic shadows')
                : (language === 'es'
                    ? 'Ambiente cálido y acogedor de café parisino con iluminación natural'
                    : 'Warm, cozy Parisian café atmosphere with natural lighting'))}
            </p>
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
          {texts.continue} {styles.find((s) => s.id === selectedStyle)?.name}
        </button>
      )}
    </div>
  )
}

