'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
      render: (container: HTMLElement, options: any) => number
    }
  }
}

interface ReCAPTCHAProps {
  siteKey: string
  action: string
  onVerify: (token: string) => void
  onError?: (error: string) => void
  invisible?: boolean
}

export default function ReCAPTCHA({
  siteKey,
  action,
  onVerify,
  onError,
  invisible = true,
}: ReCAPTCHAProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      if (invisible) {
        // Invisible reCAPTCHA v3
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(siteKey, { action })
            .then((token) => {
              onVerify(token)
            })
            .catch((error) => {
              onError?.(error.message || 'reCAPTCHA error')
            })
        })
      } else {
        // Visible reCAPTCHA v2
        if (containerRef.current) {
          window.grecaptcha.ready(() => {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current!, {
              sitekey: siteKey,
              callback: (token: string) => {
                onVerify(token)
              },
              'error-callback': () => {
                onError?.('reCAPTCHA verification failed')
              },
            })
          })
        }
      }
    }

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [siteKey, action, invisible, onVerify, onError])

  if (invisible) {
    // Invisible reCAPTCHA v3 - no UI needed
    return null
  }

  // Visible reCAPTCHA v2
  return <div ref={containerRef} />
}

/**
 * Verify reCAPTCHA token on server
 */
export async function verifyReCAPTCHA(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/recaptcha/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()
    return data.success || false
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

