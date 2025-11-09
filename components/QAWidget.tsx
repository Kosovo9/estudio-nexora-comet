'use client'

import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { type Language } from '@/lib/i18n'
import Tooltip from './Tooltip'

const texts = {
  en: {
    qaAuto: 'QA Auto',
    running: 'Running...',
    completed: 'QA Completed!',
  },
  es: {
    qaAuto: 'QA Automático',
    running: 'Ejecutando...',
    completed: 'QA Completado!',
  },
}

interface QAWidgetProps {
  lang?: Language
  floating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export default function QAWidget({ lang = 'es', floating = 'bottom-left' }: QAWidgetProps) {
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const [running, setRunning] = useState(false)
  const t = texts[lang]

  const positionMap = {
    'bottom-left': { left: 10, bottom: 16 },
    'bottom-right': { right: 10, bottom: 16 },
    'top-left': { left: 10, top: 16 },
    'top-right': { right: 10, top: 16 },
  }

  const handleRunQA = async () => {
    setRunning(true)
    try {
      const response = await fetch('/api/admin/run-qa', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        alert(`${t.completed} ${data.reportUrl ? `Report: ${data.reportUrl}` : ''}`)
        if (data.reportUrl) {
          window.open(data.reportUrl, '_blank')
        }
      } else {
        alert('Error running QA tests')
      }
    } catch (error) {
      console.error('QA error:', error)
      alert('Error running QA tests')
    } finally {
      setRunning(false)
    }
  }

  const tooltipText = {
    en: 'Run automated QA tests',
    es: 'Ejecutar pruebas QA automatizadas',
  }

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9988,
        ...positionMap[floating],
        background: '#222',
        borderRadius: 12,
        padding: '10px 18px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
      }}
    >
      <Tooltip text={tooltipText} lang={lang} position="top">
        <button
          onClick={handleRunQA}
          disabled={running}
          style={{
            color: '#fff',
            background: running ? '#666' : '#21a06e',
            fontWeight: 'bold',
            fontSize: 15,
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            cursor: running ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {running ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t.running}</span>
            </>
          ) : (
            <>
              <PlayCircle size={16} />
              <span>{t.qaAuto}</span>
            </>
          )}
        </button>
      </Tooltip>
    </div>
  )
}

