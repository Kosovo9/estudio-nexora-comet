'use client'

import { useState } from 'react'
import { type Language } from '@/lib/i18n'
import EarthSVG from './EarthSVG'
import EarthInteractive from './EarthInteractive'
import EarthViewer from './EarthViewer'

interface EarthSelectorProps {
  lang?: Language
  mode?: 'auto' | 'svg' | 'interactive' | 'full'
  floating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

/**
 * Auto-selects the best Earth component based on device capabilities
 */
export default function EarthSelector({
  lang = 'es',
  mode = 'auto',
  floating = 'bottom-right',
}: EarthSelectorProps) {
  const [show, setShow] = useState(true)

  // Auto-detect device capabilities
  const isLowEndDevice = () => {
    if (typeof window === 'undefined') return false
    
    // Check for low memory/CPU indicators
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4
    const hasLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
    
    return isMobile && (hasLowMemory || hasLowCores)
  }

  const selectedMode = mode === 'auto' ? (isLowEndDevice() ? 'svg' : 'interactive') : mode

  if (selectedMode === 'svg') {
    return <EarthSVG lang={lang} floating={floating} show={show} onToggle={() => setShow(!show)} />
  }

  if (selectedMode === 'interactive') {
    return (
      <EarthInteractive lang={lang} floating={floating} show={show} onToggle={() => setShow(!show)} />
    )
  }

  // Full version (fullscreen)
  return (
    <EarthViewer
      width="100vw"
      height="48vh"
      autoRotate={true}
      showSatellite={true}
      language={lang}
    />
  )
}

