// Keyboard Shortcuts Hook for Power Users/Admins
// Shift+E: Toggle Earth
// Shift+C: Open Copilot
// Shift+Q: Run QA
// Shift+A: Admin Dashboard

import { useEffect } from 'react'

interface KeyboardShortcutsOptions {
  onToggleEarth?: () => void
  onOpenCopilot?: () => void
  onRunQA?: () => void
  onAdminAccess?: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts({
  onToggleEarth,
  onOpenCopilot,
  onRunQA,
  onAdminAccess,
  enabled = true,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleShortcut = (e: KeyboardEvent) => {
      if (!e.shiftKey) return

      switch (e.key.toUpperCase()) {
        case 'E':
          e.preventDefault()
          onToggleEarth?.()
          break
        case 'C':
          e.preventDefault()
          onOpenCopilot?.()
          break
        case 'Q':
          e.preventDefault()
          onRunQA?.()
          break
        case 'A':
          e.preventDefault()
          onAdminAccess?.()
          break
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [enabled, onToggleEarth, onOpenCopilot, onRunQA, onAdminAccess])
}

