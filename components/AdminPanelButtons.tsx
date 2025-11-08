'use client'

import { useState } from 'react'
import { FaUsers, FaGlobe, FaRobot, FaCheckCircle, FaFileExport, FaChartBar, FaSearch } from 'react-icons/fa'
import { getTexts, type Language } from '@/lib/i18n'

interface AdminPanelButtonsProps {
  language?: Language
}

export default function AdminPanelButtons({ language }: AdminPanelButtonsProps) {
  const lang = language || 'es'
  const texts = getTexts(lang)
  const [runningQA, setRunningQA] = useState(false)
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null)

  const handleRunQA = async () => {
    setRunningQA(true)
    try {
      const response = await fetch('/api/admin/run-qa', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        alert(`QA Tests completed! Report: ${data.reportUrl || 'Check console'}`)
        if (data.reportUrl) {
          window.open(data.reportUrl, '_blank')
        }
      } else {
        alert('Error running QA tests')
      }
    } catch (error) {
      console.error('QA error:', error)
      alert('Error running QA tests')
    } finally {
      setRunningQA(false)
    }
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(format)
    try {
      const response = await fetch(`/api/admin/export?format=${format}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nexora-export-${Date.now()}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        alert(`Error exporting ${format.toUpperCase()}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert(`Error exporting ${format.toUpperCase()}`)
    } finally {
      setExporting(null)
    }
  }

  const buttonTexts = {
    en: {
      affiliates: 'Affiliates',
      whitePage: 'White Page',
      dashboard: 'Admin',
      copilot: 'Copilot',
      qaShortcut: 'QA Shortcut',
      exportCSV: 'Export CSV',
      exportPDF: 'Export PDF',
    },
    es: {
      affiliates: 'Afiliados',
      whitePage: 'White Page',
      dashboard: 'Dashboard',
      copilot: 'Copilot',
      qaShortcut: 'QA Shortcut',
      exportCSV: 'Exportar CSV',
      exportPDF: 'Exportar PDF',
    },
  }

  const t = buttonTexts[lang]

  const buttons = [
    {
      label: t.affiliates,
      icon: <FaUsers size={16} />,
      href: '/affiliates',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: t.whitePage,
      icon: <FaGlobe size={16} />,
      href: '/white-pages',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      label: t.copilot,
      icon: <FaRobot size={16} />,
      href: '/admin/chat',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      label: t.dashboard,
      icon: <FaCheckCircle size={16} />,
      href: '/admin/dashboard',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'SEO',
      icon: <FaSearch size={16} />,
      href: '/admin/seo',
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      label: t.qaShortcut,
      icon: <FaCheckCircle size={16} />,
      onClick: handleRunQA,
      loading: runningQA,
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      label: t.exportCSV,
      icon: <FaFileExport size={16} />,
      onClick: () => handleExport('csv'),
      loading: exporting === 'csv',
      color: 'bg-teal-500 hover:bg-teal-600',
    },
    {
      label: t.exportPDF,
      icon: <FaFileExport size={16} />,
      onClick: () => handleExport('pdf'),
      loading: exporting === 'pdf',
      color: 'bg-red-500 hover:bg-red-600',
    },
  ]

  return (
    <aside className="flex flex-row flex-wrap gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick || (() => (window.location.href = button.href!))}
          disabled={button.loading}
          className={`${button.color} px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-white`}
        >
          {button.loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{lang === 'es' ? 'Cargando...' : 'Loading...'}</span>
            </>
          ) : (
            <>
              {button.icon}
              <span>{button.label}</span>
            </>
          )}
        </button>
      ))}
    </aside>
  )
}

