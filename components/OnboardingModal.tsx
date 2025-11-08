'use client'

import { useState, useEffect } from 'react'
import { type Language } from '@/lib/i18n'

const onboardingText = {
  es: [
    '¡Bienvenido a la experiencia Nexora Pro!',
    '• Usa el 🌍 para mostrar nuestro planeta interactivo, fácil de ocultar/mover.',
    '• Haz clic en Copiloto (🤖) para tener ayuda AI en todo momento.',
    '• Usa el botón QA para pruebas automáticas de tu app y exportación instantánea.',
    '• Todos los menús son responsive, accesibles y puedes moverlos en la UI.',
    '• Atajos de teclado disponibles (ver abajo).',
  ],
  en: [
    'Welcome to Nexora Pro Experience!',
    '• Use the 🌍 button for our interactive earth, easy to hide/move.',
    '• Click Copilot (🤖) for AI help anywhere, anytime.',
    '• Use QA for instant app auto-testing and one-click export.',
    '• All menus are responsive, accessible and movable around UI.',
    '• Keyboard shortcuts available (see below).',
  ],
}

const keyShortcuts = {
  es: [
    '[Shift]+[E] = Mostrar/Ocultar Tierra',
    '[Shift]+[C] = Copiloto rápido',
    '[Shift]+[Q] = Ejecutar QA ahora',
    '[Shift]+[A] = Acceso admin rápido',
  ],
  en: [
    '[Shift]+[E] = Show/Hide Earth',
    '[Shift]+[C] = Fast Copilot',
    '[Shift]+[Q] = Run QA now',
    '[Shift]+[A] = Quick admin access',
  ],
}

interface OnboardingModalProps {
  lang?: Language
  onClose?: () => void
}

export default function OnboardingModal({ lang = 'es', onClose }: OnboardingModalProps) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('nexora_onboarding_seen') === 'true'
    if (hasSeenOnboarding) {
      setOpen(false)
      onClose?.()
      return
    }

    // Close modal with [Esc]
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        localStorage.setItem('nexora_onboarding_seen', 'true')
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem('nexora_onboarding_seen', 'true')
    onClose?.()
  }

  if (!open) return null

  const t = {
    title: lang === 'es' ? 'Guía Rápida' : 'Quick Start Guide',
    shortcuts: lang === 'es' ? 'Atajos de teclado:' : 'Keyboard Shortcuts:',
    close: lang === 'es' ? 'Cerrar y continuar' : 'Close and continue',
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 30000,
        background: 'rgba(20, 28, 40, 0.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '36px 38px',
          borderRadius: 22,
          minWidth: 340,
          maxWidth: 400,
          maxHeight: '75vh',
          overflowY: 'auto',
          boxShadow: '0 0 40px rgba(38, 49, 77, 0.4)',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#183E7A', marginBottom: 10 }}>{t.title}</h2>
        <ul style={{ fontSize: 18, margin: '18px 0 10px', paddingLeft: 20 }}>
          {onboardingText[lang].map((text, index) => (
            <li key={index} style={{ marginBottom: 5, lineHeight: 1.5 }}>
              {text}
            </li>
          ))}
        </ul>
        <div style={{ margin: '16px 0 6px', fontWeight: 600, color: '#374' }}>
          {t.shortcuts}
        </div>
        <ul
          style={{
            fontFamily: 'monospace',
            background: '#f3f4f7',
            padding: 9,
            borderRadius: 9,
            listStyle: 'none',
            paddingLeft: 20,
          }}
        >
          {keyShortcuts[lang].map((shortcut, index) => (
            <li key={index} style={{ marginBottom: 4 }}>
              {shortcut}
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          style={{
            marginTop: 22,
            width: '100%',
            background: '#183E7A',
            color: '#fff',
            borderRadius: 12,
            fontWeight: 'bold',
            padding: '11px 0',
            fontSize: 19,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {t.close}
        </button>
      </div>
    </div>
  )
}

