'use client'

import { useState, useEffect } from 'react'

export type Theme = 'dark' | 'light'

export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check localStorage first
    const storedTheme = localStorage.getItem('nexora-theme') as Theme
    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
      setTheme(storedTheme)
      return
    }

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme(mediaQuery.matches ? 'dark' : 'light')

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('nexora-theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return theme
}

export function useThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedTheme = localStorage.getItem('nexora-theme') as Theme
    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
      setTheme(storedTheme)
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setTheme(mediaQuery.matches ? 'dark' : 'light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('nexora-theme', newTheme)
    
    // Apply theme to body
    if (typeof document !== 'undefined') {
      document.body.style.background = newTheme === 'dark' ? '#202634' : '#f4f6f9'
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.background = theme === 'dark' ? '#202634' : '#f4f6f9'
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  return { theme, toggleTheme }
}

