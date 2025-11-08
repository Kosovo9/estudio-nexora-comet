'use client'

import { type Language } from '@/lib/i18n'

interface OnboardingMiniProps {
  lang?: Language
  step: 'ai' | 'pay' | 'download' | 'watermark' | 'upload'
}

const info = {
  ai: {
    es: '¡Estás generando tu foto AI! Usa el progreso y revisa siempre los mensajes antes de finalizar.',
    en: "You're generating your AI photo! Use the progress bar and always check messages before finishing.",
  },
  pay: {
    es: '¡Listo para pago seguro! Puedes pagar con tarjeta, transferencia o tu método favorito.',
    en: 'Secure payment ready! You can pay with card, wire, or your favorite method.',
  },
  download: {
    es: 'Descarga tu foto. Recuerda: solo estará disponible 24h.',
    en: "Download your photo. Note: It'll only be available for 24h.",
  },
  watermark: {
    es: 'Vista previa con marca de agua. Después del pago podrás descargar sin marca de agua.',
    en: 'Watermark preview. After payment, you can download without watermark.',
  },
  upload: {
    es: 'Sube al menos 3 fotos para comenzar. Formatos: JPG, PNG, WEBP.',
    en: 'Upload at least 3 photos to start. Formats: JPG, PNG, WEBP.',
  },
}

export default function OnboardingMini({ lang = 'es', step }: OnboardingMiniProps) {
  const text = info[step][lang]

  return (
    <div
      style={{
        padding: '12px 24px',
        borderRadius: 10,
        background: '#e3f2fd',
        color: '#136',
        margin: '12px 0',
        boxShadow: '0 2px 14px rgba(25, 118, 210, 0.08)',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      {text}
    </div>
  )
}

