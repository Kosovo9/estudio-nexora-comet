'use client'

import { type Language } from '@/lib/i18n'

interface QAProgressProps {
  steps?: string[]
  currentStep?: number
  lang?: Language
}

const defaultSteps = ['Upload', 'Consent', 'Style', 'Generate', 'Preview', 'Payment']

const stepLabels = {
  es: ['Subir imágenes', 'Consentimiento', 'Estilo', 'Genera', 'Revisar', 'Pagar'],
  en: ['Upload', 'Consent', 'Style', 'Generate', 'Preview', 'Payment'],
}

export default function QAProgress({
  steps = defaultSteps,
  currentStep = 1,
  lang = 'es',
}: QAProgressProps) {
  const labels = stepLabels[lang]

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 18,
        flexWrap: 'wrap',
      }}
    >
      {steps.map((step, i) => {
        const stepIndex = i + 1
        const isCompleted = stepIndex < currentStep
        const isCurrent = stepIndex === currentStep
        const label = labels[i] || step

        return (
          <div
            key={i}
            style={{
              fontWeight: isCompleted ? 700 : isCurrent ? 600 : 500,
              color: isCompleted ? '#37cd73' : isCurrent ? '#3b82f6' : '#aaa',
              fontSize: '14px',
              padding: '4px 8px',
              borderRadius: 6,
              background: isCurrent ? '#3b82f620' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            {isCompleted ? '✔ ' : isCurrent ? '→ ' : ''}
            {label}
          </div>
        )
      })}
    </div>
  )
}

