'use client'

import { Sun, Moon } from 'lucide-react'
import { useThemeToggle } from '@/hooks/useTheme'
import { type Language } from '@/lib/i18n'
import Tooltip from './Tooltip'

interface ThemeToggleProps {
  lang?: Language
}

export default function ThemeToggle({ lang = 'es' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeToggle()

  const tooltipText = {
    en: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    es: theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro',
  }

  return (
    <Tooltip text={tooltipText} lang={lang} position="bottom">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        aria-label={tooltipText[lang]}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </button>
    </Tooltip>
  )
}

