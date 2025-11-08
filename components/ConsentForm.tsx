'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { type Language, getTexts } from '@/lib/i18n'

interface ConsentFormProps {
  onSubmit: () => void
  language?: Language
}

export default function ConsentForm({ onSubmit, language }: ConsentFormProps) {
  const texts = getTexts(language)
  const [consent, setConsent] = useState({
    imageUse: false,
    dataProcessing: false,
    commercialUse: false,
  })

  const allChecked = consent.imageUse && consent.dataProcessing && consent.commercialUse

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (allChecked) {
      onSubmit()
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{texts.consent}</h2>
      <p className="text-gray-400 mb-6">
        {language === 'es'
          ? 'Por favor revisa y autoriza el uso de tus imágenes'
          : 'Please review and authorize the use of your images'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-700/50 rounded-lg p-6 space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.imageUse}
              onChange={(e) =>
                setConsent({ ...consent, imageUse: e.target.checked })
              }
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
            />
            <div>
              <div className="font-semibold">
                {language === 'es' ? 'Autorización de Uso de Imágenes' : 'Image Use Authorization'}
              </div>
              <div className="text-sm text-gray-400">
                {language === 'es'
                  ? 'Autorizo a Studio Nexora Comet a usar mis imágenes subidas para procesamiento y generación con IA.'
                  : 'I authorize Studio Nexora Comet to use my uploaded images for AI processing and generation purposes.'}
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.dataProcessing}
              onChange={(e) =>
                setConsent({ ...consent, dataProcessing: e.target.checked })
              }
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
            />
            <div>
              <div className="font-semibold">
                {language === 'es' ? 'Consentimiento de Procesamiento de Datos' : 'Data Processing Consent'}
              </div>
              <div className="text-sm text-gray-400">
                {language === 'es'
                  ? 'Consiento el procesamiento de mis imágenes usando Google AI Studio y servicios relacionados para generación de imágenes.'
                  : 'I consent to the processing of my images using Google AI Studio and related services for image generation.'}
              </div>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.commercialUse}
              onChange={(e) =>
                setConsent({ ...consent, commercialUse: e.target.checked })
              }
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
            />
            <div>
              <div className="font-semibold">
                {language === 'es' ? 'Acuerdo de Uso Comercial' : 'Commercial Use Agreement'}
              </div>
              <div className="text-sm text-gray-400">
                {language === 'es'
                  ? 'Entiendo que las imágenes generadas pueden usarse para fines comerciales y tengo derecho a usar el resultado final.'
                  : 'I understand that the generated images may be used for commercial purposes and I have the right to use the final output.'}
              </div>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={!allChecked}
          className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {allChecked && <CheckCircle className="w-5 h-5" />}
          <span>{texts.continue}</span>
        </button>
      </form>
    </div>
  )
}

