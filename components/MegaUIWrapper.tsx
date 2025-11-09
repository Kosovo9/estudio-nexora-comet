'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getLanguage, type Language } from '@/lib/i18n'
import MegaUI from './MegaUI'
import ThemeToggle from './ThemeToggle'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function MegaUIWrapper() {
  const { user, isLoaded } = useUser()
  const [language, setLanguage] = useState<Language>('en')
  const [showEarth, setShowEarth] = useState(true)
  const [showCopilot, setShowCopilot] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      const lang = getLanguage()
      setLanguage(lang)
    }
  }, [isLoaded])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleEarth: () => setShowEarth((v) => !v),
    onOpenCopilot: () => setShowCopilot((v) => !v),
    onRunQA: async () => {
      try {
        await fetch('/api/admin/run-qa', { method: 'POST' })
      } catch (error) {
        console.error('QA error:', error)
      }
    },
    onAdminAccess: () => {
      window.location.href = '/admin/dashboard'
    },
    enabled: isLoaded,
  })

  if (!isLoaded) return null

  return (
    <>
      <MegaUI
        lang={language}
        earthFloating="top-right"
        copilotFloating="bottom-right"
        qaFloating="bottom-left"
        user={{
          id: user?.id,
          email: user?.emailAddresses[0]?.emailAddress,
          lang: language,
        }}
      />

      {/* Theme Toggle - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle lang={language} />
      </div>
    </>
  )
}

