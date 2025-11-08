'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getLanguage, type Language } from '@/lib/i18n'
import MegaUI from './MegaUI'
import OnboardingModal from './OnboardingModal'
import ThemeToggle from './ThemeToggle'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function MegaUIWrapper() {
  const { user, isLoaded } = useUser()
  const [language, setLanguage] = useState<Language>('en')
  const [showEarth, setShowEarth] = useState(true)
  const [showCopilot, setShowCopilot] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      const lang = getLanguage()
      setLanguage(lang)

      // Show onboarding on first visit
      const hasSeenOnboarding = localStorage.getItem('nexora_onboarding_seen') === 'true'
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
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
      {showOnboarding && (
        <OnboardingModal
          lang={language}
          onClose={() => setShowOnboarding(false)}
        />
      )}
      <MegaUI
        lang={language}
        earthFloating="top-left"
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

