'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getTexts, type Language } from '@/lib/i18n'
import OnboardingMini from './OnboardingMini'

interface AIGenerationProps {
  onGenerate: () => Promise<string>
  selectedStyle: 'dark-studio' | 'paris-cafe'
  isReady: boolean
  language?: Language
}

export default function AIGeneration({ onGenerate, selectedStyle, isReady, language }: AIGenerationProps) {
  const texts = getTexts(language)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [success, setSuccess] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    // Warning at 12 seconds
    if (timer >= 12 && timer < 20 && isGenerating) {
      // Warning is shown in UI, no need to set error
    }
    // Timeout automático después de 20 segundos
    if (timer > 20 && isGenerating) {
      setError(texts.timeoutLong)
      setIsGenerating(false)
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setTimer(0)
      
      // Track timeout event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const userId = (window as any).Clerk?.user?.id || 'anonymous'
        ;(window as any).gtag('event', 'ai_image_generate_timeout', {
          style: selectedStyle,
          duration: timer,
          userId,
          timestamp: new Date().toISOString(),
        })
      }
    }
  }, [timer, isGenerating, texts.timeoutLong, selectedStyle])

  const handleGenerate = async () => {
    if (!isReady) return

    // Track AI generation start event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const userId = (window as any).Clerk?.user?.id || 'anonymous'
      const lang = navigator.language || 'en'
      ;(window as any).gtag('event', 'ai_image_generate_start', {
        style: selectedStyle,
        lang,
        userId,
        timestamp: new Date().toISOString(),
      })
    }

    setIsGenerating(true)
    setError('')
    setSuccess(false)
    setTimer(0)

    // Iniciar timer
    let secondsWaited = 0
    intervalIdRef.current = setInterval(() => {
      secondsWaited += 1
      setTimer(secondsWaited)
    }, 1000)

    // Timeout de seguridad (25 segundos) - Detección de bloqueo
    timeoutRef.current = setTimeout(() => {
      if (isGenerating) {
        setError(texts.timeoutLong)
        setIsGenerating(false)
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
          intervalIdRef.current = null
        }
        setTimer(0)
        
        // Log para debugging
        console.error('AI Generation timeout after 25 seconds - possible blocking detected')
        
        // Track timeout event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          const userId = (window as any).Clerk?.user?.id || 'anonymous'
          ;(window as any).gtag('event', 'ai_image_generate_timeout', {
            style: selectedStyle,
            duration: 25,
            userId,
            timestamp: new Date().toISOString(),
          })
        }
        
        // Opcional: Enviar a error tracking (Sentry, etc.)
        if (typeof window !== 'undefined' && (window as any).Sentry) {
          (window as any).Sentry.captureException(new Error('AI Generation timeout after 25s'))
        }
      }
    }, 25000)

    try {
      // Abort controller para cancelar request si es necesario
      abortControllerRef.current = new AbortController()
      
      // Timeout adicional para fetch (si onGenerate usa fetch)
      const fetchTimeout = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
      }, 22000) // 22 segundos para dar tiempo al timeout de UI

      const result = await Promise.race([
        onGenerate(),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), 22000)
        )
      ])

      clearTimeout(fetchTimeout)

      // Limpiar timers
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      setTimer(0)
      setIsGenerating(false)
      setSuccess(true)
      setDownloadReady(true)

      // Track AI generation success event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const userId = (window as any).Clerk?.user?.id || 'anonymous'
        ;(window as any).gtag('event', 'ai_image_generate_success', {
          style: selectedStyle,
          duration: timer,
          userId,
          timestamp: new Date().toISOString(),
        })
      }

      // Trigger Earth glow animation on success
      if (typeof window !== 'undefined') {
        const { triggerEarthGlow, triggerCelebration } = require('@/lib/ui-animations')
        triggerEarthGlow(2000)
        triggerCelebration('generation')
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (e: any) {
      // Limpiar timers y abort controller
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      setTimer(0)
      setIsGenerating(false)
      
      // Mensajes de error más específicos
      let errorMessage = texts.error
      
      if (e?.message?.includes('timeout') || e?.message?.includes('aborted') || e?.message?.includes('Operation timeout')) {
        errorMessage = texts.timeout
      } else if (e?.message?.includes('quota') || e?.message?.includes('credits')) {
        errorMessage = language === 'es' 
          ? 'Créditos de AI agotados. Por favor, contacta soporte o intenta más tarde.'
          : 'AI credits exhausted. Please contact support or try later.'
      } else if (e?.message?.includes('connection') || e?.message?.includes('network')) {
        errorMessage = language === 'es'
          ? 'Error de conexión. Verifica tu internet e intenta nuevamente.'
          : 'Connection error. Check your internet and try again.'
      } else if (e?.message) {
        errorMessage = e.message
      }
      
      setError(errorMessage)
      
      // Track AI generation error event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const userId = (window as any).Clerk?.user?.id || 'anonymous'
        ;(window as any).gtag('event', 'ai_image_generate_error', {
          style: selectedStyle,
          error: e?.message || 'Unknown error',
          duration: timer,
          userId,
          timestamp: new Date().toISOString(),
        })
      }
      
      // Log para debugging
      console.error('AI Generation error:', e)
      
      // Enviar a error tracking
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(e)
      }
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="w-full">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold mb-4">{texts.readyToGenerate}</h2>
        <p className="text-gray-400 mb-6">
          {texts.style}: <span className="font-semibold text-white">
            {selectedStyle === 'dark-studio' ? texts.darkStudio : texts.parisCafe}
          </span>
        </p>

        {/* Onboarding Mini for AI Generation */}
        {!isGenerating && !downloadReady && (
          <OnboardingMini lang={language} step="ai" />
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{texts.generationSuccess}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Generating State */}
        {isGenerating && (
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              <div className="text-left">
                <p className="text-blue-400 font-semibold">
                  {texts.generating}
                </p>
                <p className="text-blue-300 text-sm">
                  {texts.timer} <span className="font-mono font-bold">{formatTime(timer)}</span>
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min((timer / 20) * 100, 95)}%`,
                }}
              />
            </div>

            <p className="text-xs text-gray-400 text-center">
              {texts.generationTimeDisclaimer}
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !isReady}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 mx-auto"
          aria-label={language === 'es' ? 'Generar Imagen AI' : 'Generate AI Image'}
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{language === 'es' ? 'Generando...' : 'Generating...'}</span>
            </>
          ) : (
            <span>{texts.generateImageAI || (language === 'es' ? 'Generar Imagen AI' : 'Generate AI Image')}</span>
          )}
        </button>

        {/* Helpful tips */}
        {!isGenerating && !error && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>{texts.tipGenerationTime}</p>
            <p>{texts.tipStableConnection}</p>
          </div>
        )}

        {/* Warning at 12 seconds */}
        {isGenerating && timer >= 12 && timer < 20 && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 mt-4">
            <p className="text-yellow-400 text-sm">
              ⏳ {texts.almostReady}
            </p>
          </div>
        )}

        {/* Download Ready */}
        {downloadReady && !isGenerating && (
          <div className="mt-6 space-y-4">
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-4">
              <p className="text-green-400 font-semibold">{texts.success}</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm(texts.confirmDownload)) {
                  setShowDownload(true)
                  // Download logic will be handled by parent component
                }
              }}
              className="px-8 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-all w-full"
            >
              {texts.download}
            </button>
            {showDownload && (
              <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 mt-4">
                <p className="text-orange-400 text-sm mb-2">{texts.downloading}</p>
                <p className="text-orange-300 text-xs">{texts.downloadDisclaimer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

