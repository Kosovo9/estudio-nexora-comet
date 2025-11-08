'use client'

import { ReactNode } from 'react'
import { type Language } from '@/lib/i18n'

interface SimpleTooltipProps {
  text: string | { en: string; es: string }
  children: ReactNode
  lang?: Language
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function SimpleTooltip({
  text,
  children,
  lang = 'es',
  position = 'top',
}: SimpleTooltipProps) {
  const tooltipText = typeof text === 'string' ? text : text[lang]

  const positionStyles = {
    top: {
      bottom: '130%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      top: '130%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      right: '130%',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    right: {
      left: '130%',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  }

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      <span
        className="simple-tooltip"
        style={{
          visibility: 'hidden',
          background: '#232841',
          color: '#fff',
          fontSize: 16,
          borderRadius: 8,
          position: 'absolute',
          whiteSpace: 'nowrap',
          zIndex: 100,
          transition: 'opacity 0.18s',
          opacity: 0,
          padding: '8px 12px',
          pointerEvents: 'none',
          ...positionStyles[position],
        }}
      >
        {tooltipText}
      </span>
      <style jsx>{`
        span:hover > .simple-tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </span>
  )
}

