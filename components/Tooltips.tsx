'use client'

import SimpleTooltip from './SimpleTooltip'

interface TooltipsProps {
  language: string
}

export default function Tooltips({ language }: TooltipsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Quick Tips' : 'Consejos Rápidos'}
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        <SimpleTooltip
          text={
            language === 'en'
              ? 'Upload 3+ photos for best results'
              : 'Sube 3+ fotos para mejores resultados'
          }
        >
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl mb-2">📸</div>
            <div className="font-semibold">
              {language === 'en' ? 'Photo Upload' : 'Subida de Fotos'}
            </div>
          </div>
        </SimpleTooltip>

        <SimpleTooltip
          text={
            language === 'en'
              ? 'Choose from Dark Studio or Paris Café style'
              : 'Elige entre estilo Dark Studio o Paris Café'
          }
        >
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-semibold">
              {language === 'en' ? 'AI Styles' : 'Estilos IA'}
            </div>
          </div>
        </SimpleTooltip>

        <SimpleTooltip
          text={
            language === 'en'
              ? 'Download without watermark after payment'
              : 'Descarga sin marca de agua después del pago'
          }
        >
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold">
              {language === 'en' ? 'Payment' : 'Pago'}
            </div>
          </div>
        </SimpleTooltip>
      </div>
    </div>
  )
}


