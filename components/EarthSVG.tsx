'use client'

import { useState } from 'react'
import { type Language } from '@/lib/i18n'
import Tooltip from './Tooltip'

const texts = {
  en: { show: 'Show Earth', hide: 'Hide Earth' },
  es: { show: 'Mostrar Tierra', hide: 'Ocultar Tierra' },
}

interface EarthSVGProps {
  lang?: Language
  floating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  show?: boolean
  onToggle?: () => void
}

export default function EarthSVG({
  lang = 'es',
  floating = 'bottom-right',
  show: initialShow = true,
  onToggle,
}: EarthSVGProps) {
  const [show, setShow] = useState(initialShow)

  const positionMap = {
    'bottom-right': { right: 16, bottom: 16 },
    'bottom-left': { left: 16, bottom: 16 },
    'top-right': { right: 16, top: 16 },
    'top-left': { left: 16, top: 16 },
  }

  const toggle = () => {
    setShow(!show)
    onToggle?.()
  }

  const t = texts[lang]

  if (show) {
    return (
      <div
        style={{
          position: 'fixed',
          zIndex: 999,
          borderRadius: '50%',
          background: '#181e28',
          ...positionMap[floating],
          width: 120,
          height: 120,
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}
      >
        {/* SVG hiperrealista, con sombreado y "glow" azul difuminado */}
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <radialGradient id="earthGradient" r="60%" cx="60%" cy="35%">
              <stop offset="0%" stopColor="#80b3fc" />
              <stop offset="80%" stopColor="#192336" />
            </radialGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="58"
            fill="url(#earthGradient)"
            stroke="#165cb6"
            strokeWidth="2"
          />
          {/* Continentes simplificados, nubes/desiertos estilizados */}
          <ellipse cx="48" cy="62" rx="25" ry="16" fill="#7cb342" opacity="0.7" />
          <ellipse cx="66" cy="57" rx="16" ry="10" fill="#eed68c" opacity="0.4" />
          <ellipse cx="60" cy="75" rx="17" ry="7" fill="#90caf9" opacity="0.3" />
          {/* Sombra a la derecha */}
          <ellipse cx="83" cy="62" rx="22" ry="18" fill="#253550" opacity="0.48" />
        </svg>

        {/* Botón floating super responsive */}
        <Tooltip
          text={
            lang === 'es'
              ? 'Oculta/muestra el mundo 3D'
              : 'Show/hide the 3D world'
          }
          lang={lang}
          position="bottom"
        >
          <button
            onClick={toggle}
            style={{
              position: 'absolute',
              top: '-36px',
              right: '6px',
              padding: '6px 16px',
              borderRadius: 9,
              background: '#fff',
              fontWeight: 'bold',
              boxShadow: '0 1px 4px rgba(34,34,34,0.4)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {t.hide}
          </button>
        </Tooltip>
      </div>
    )
  }

  return (
    <Tooltip
      text={
        lang === 'es'
          ? 'Oculta/muestra el mundo 3D'
          : 'Show/hide the 3D world'
      }
      lang={lang}
      position="bottom"
    >
      <button
        onClick={toggle}
        style={{
          position: 'fixed',
          ...positionMap[floating],
          zIndex: 997,
          padding: '8px 18px',
          borderRadius: 10,
          fontWeight: 600,
          background: '#222',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        {t.show}
      </button>
    </Tooltip>
  )
}

