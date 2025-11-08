'use client'

import { ReactNode } from 'react'
import { type Language } from '@/lib/i18n'

interface TooltipProps {
  text: string | { en: string; es: string }
  children: ReactNode
  lang?: Language
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({ text, children, lang = 'es', position = 'top' }: TooltipProps) {
  const tooltipText = typeof text === 'string' ? text : text[lang]

  const positionStyles = {
    top: {
      bottom: '120%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      top: '120%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      right: '120%',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    right: {
      left: '120%',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <span
        className="tooltip-text"
        style={{
          visibility: 'hidden',
          background: '#222',
          color: '#fff',
          textAlign: 'center',
          padding: '5px 11px',
          borderRadius: '7px',
          position: 'absolute',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          fontSize: '13px',
          opacity: 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
          ...positionStyles[position],
        }}
      >
        {tooltipText}
      </span>
      <style jsx>{`
        div:hover > .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

