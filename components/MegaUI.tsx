'use client'

import { useState, useEffect } from 'react'
import { type Language } from '@/lib/i18n'
import EarthSVG from './EarthSVG'
import EarthInteractive from './EarthInteractive'
import CopilotWidget from './CopilotWidget'
import QAWidget from './QAWidget'

/**
 * Detecta si el dispositivo es low-end
 */
function detectLowEnd(): boolean {
  if (typeof window === 'undefined') return false

  // Check user agent
  const isMobile = /android|iphone|ipod|ipad/i.test(navigator.userAgent)

  // Check device memory (si está disponible)
  const deviceMemory = (navigator as any).deviceMemory
  const hasLowMemory = deviceMemory && deviceMemory < 3

  // Check hardware concurrency (CPU cores)
  const hardwareConcurrency = navigator.hardwareConcurrency
  const hasLowCores = hardwareConcurrency && hardwareConcurrency < 4

  // Check connection (si es slow, probablemente es low-end)
  const connection = (navigator as any).connection
  const isSlowConnection =
    connection &&
    (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')

  return isMobile && (hasLowMemory || hasLowCores || isSlowConnection)
}

interface MegaUIProps {
  lang?: Language
  earthFloating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  copilotFloating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  qaFloating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  user?: {
    id?: string
    email?: string
    lang?: Language
  }
}

export default function MegaUI({
  lang = 'es',
  earthFloating = 'top-left',
  copilotFloating = 'bottom-right',
  qaFloating = 'bottom-left',
  user,
}: MegaUIProps) {
  const [showEarth, setShowEarth] = useState(true)
  const [useSVG, setUseSVG] = useState(true)

  useEffect(() => {
    setUseSVG(detectLowEnd())
  }, [])

  return (
    <>
      {useSVG ? (
        <EarthSVG
          lang={lang}
          floating={earthFloating}
          show={showEarth}
          onToggle={() => setShowEarth((v) => !v)}
        />
      ) : (
        <EarthInteractive
          lang={lang}
          floating={earthFloating}
          show={showEarth}
          onToggle={() => setShowEarth((v) => !v)}
        />
      )}

      <CopilotWidget user={user} floating={copilotFloating} />
      <QAWidget lang={lang} floating={qaFloating} />
    </>
  )
}

