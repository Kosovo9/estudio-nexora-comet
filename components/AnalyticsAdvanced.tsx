'use client'

import { useEffect } from 'react'

export default function AnalyticsAdvanced() {
  useEffect(() => {
    // Hotjar
    const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID
    if (hotjarId && typeof window !== 'undefined') {
      ;(window as any).hj = (window as any).hj || function() {
        ((window as any).hj.q = (window as any).hj.q || []).push(arguments)
      }
      ;(window as any).hj('settings', { hjid: parseInt(hotjarId), hjsv: 6 })
      const script = document.createElement('script')
      script.src = `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=6`
      document.head.appendChild(script)
    }
  }, [])

  return null
}

