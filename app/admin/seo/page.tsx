'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp, FileText, Globe } from 'lucide-react'
import { getLanguage, type Language } from '@/lib/i18n'

interface SEOScore {
  seo: number
  accessibility: number
  performance: number
  date: string
}

interface SEOAlert {
  date: string
  seoScore: number
  accessibilityScore: number
  performanceScore: number
  url: string
  threshold: number
}

interface KeywordData {
  url: string
  title: string
  keywords: string[]
  h1: string
}

export default function AdminSEO() {
  const { user, isLoaded } = useUser()
  const [language, setLanguage] = useState<Language>('en')
  const [scores, setScores] = useState<SEOScore[]>([])
  const [alerts, setAlerts] = useState<SEOAlert[]>([])
  const [keywords, setKeywords] = useState<KeywordData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentScore, setCurrentScore] = useState<SEOScore | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      setLanguage(getLanguage())
      fetchSEOData()
    }
  }, [isLoaded, user])

  const fetchSEOData = async () => {
    try {
      // Fetch scores (simulado - en producción, esto vendría de una API o base de datos)
      const scoresResponse = await fetch('/api/admin/seo/scores')
      if (scoresResponse.ok) {
        const scoresData = await scoresResponse.json()
        setScores(scoresData.scores || [])
        if (scoresData.current) {
          setCurrentScore(scoresData.current)
        }
      }

      // Fetch alerts
      const alertsResponse = await fetch('/api/admin/seo/alerts')
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData.alerts || [])
      }

      // Fetch keywords
      const keywordsResponse = await fetch('/api/admin/seo/keywords')
      if (keywordsResponse.ok) {
        const keywordsData = await keywordsResponse.json()
        setKeywords(keywordsData.keywords || [])
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runSEOAudit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/seo/audit', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        alert(`✅ Auditoría SEO completada!\n\nScore SEO: ${data.seoScore}/100`)
        fetchSEOData()
      } else {
        alert('❌ Error ejecutando auditoría SEO')
      }
    } catch (error) {
      console.error('Error running SEO audit:', error)
      alert('❌ Error ejecutando auditoría SEO')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access SEO dashboard</p>
        </div>
      </div>
    )
  }

  const t = {
    title: language === 'es' ? 'Dashboard SEO' : 'SEO Dashboard',
    lighthouse: language === 'es' ? 'Score Lighthouse' : 'Lighthouse Score',
    keywords: language === 'es' ? 'Keywords principales' : 'Main Keywords',
    alerts: language === 'es' ? 'Alertas recibidas' : 'Alerts Received',
    suggestions: language === 'es' ? 'Sugerencias de optimización' : 'Optimization Suggestions',
    reports: language === 'es' ? 'Últimos reportes' : 'Latest Reports',
    runAudit: language === 'es' ? 'Ejecutar Auditoría SEO' : 'Run SEO Audit',
    seo: 'SEO',
    accessibility: language === 'es' ? 'Accesibilidad' : 'Accessibility',
    performance: language === 'es' ? 'Rendimiento' : 'Performance',
    lastWeek: language === 'es' ? 'Última semana' : 'Last week',
    noAlerts: language === 'es' ? 'No hay alertas' : 'No alerts',
    noKeywords: language === 'es' ? 'No hay keywords' : 'No keywords',
    noReports: language === 'es' ? 'No hay reportes' : 'No reports',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <button
            onClick={runSEOAudit}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <BarChart3 className="w-5 h-5" />
            <span>{t.runAudit}</span>
          </button>
        </div>

        {/* Current Scores */}
        {currentScore && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ScoreCard
              title={t.seo}
              value={currentScore.seo}
              icon={<BarChart3 className="w-6 h-6" />}
              color={currentScore.seo >= 90 ? 'green' : currentScore.seo >= 70 ? 'yellow' : 'red'}
            />
            <ScoreCard
              title={t.accessibility}
              value={currentScore.accessibility}
              icon={<CheckCircle className="w-6 h-6" />}
              color={currentScore.accessibility >= 90 ? 'green' : currentScore.accessibility >= 70 ? 'yellow' : 'red'}
            />
            <ScoreCard
              title={t.performance}
              value={currentScore.performance}
              icon={<TrendingUp className="w-6 h-6" />}
              color={currentScore.performance >= 90 ? 'green' : currentScore.performance >= 70 ? 'yellow' : 'red'}
            />
          </div>
        )}

        {/* Keywords by Language */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>{t.keywords}</span>
          </h2>
          {keywords.length === 0 ? (
            <p className="text-gray-400">{t.noKeywords}</p>
          ) : (
            <div className="space-y-4">
              {keywords.map((kw, i) => (
                <div key={i} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="font-semibold mb-2">{kw.url}</div>
                  <div className="text-sm text-gray-300 mb-1">
                    <strong>Title:</strong> {kw.title}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    <strong>H1:</strong> {kw.h1}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Keywords:</strong> {kw.keywords.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span>{t.alerts} ({t.lastWeek})</span>
          </h2>
          {alerts.length === 0 ? (
            <p className="text-gray-400">{t.noAlerts}</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert, i) => (
                <div key={i} className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-red-400">
                        SEO Score: {alert.seoScore}/100 (Threshold: {alert.threshold})
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(alert.date).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-300 mt-2">
                        URL: {alert.url}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Accessibility: {alert.accessibilityScore}/100</div>
                      <div>Performance: {alert.performanceScore}/100</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optimization Suggestions */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{t.suggestions}</h2>
          <div className="space-y-2">
            <SuggestionItem
              text={language === 'es' ? 'Optimizar imágenes (usar WebP, lazy loading)' : 'Optimize images (use WebP, lazy loading)'}
              priority="high"
            />
            <SuggestionItem
              text={language === 'es' ? 'Agregar más contenido relevante con keywords' : 'Add more relevant content with keywords'}
              priority="medium"
            />
            <SuggestionItem
              text={language === 'es' ? 'Mejorar velocidad de carga (minificar CSS/JS)' : 'Improve load speed (minify CSS/JS)'}
              priority="high"
            />
            <SuggestionItem
              text={language === 'es' ? 'Verificar que todas las imágenes tengan alt tags' : 'Verify all images have alt tags'}
              priority="medium"
            />
            <SuggestionItem
              text={language === 'es' ? 'Agregar Schema.org a todas las páginas' : 'Add Schema.org to all pages'}
              priority="low"
            />
          </div>
        </div>

        {/* Latest Reports */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{t.reports}</span>
          </h2>
          <div className="space-y-2">
            <ReportItem
              name="seo-report-2024-11-08.html"
              date="2024-11-08"
              size="2.3 MB"
            />
            <ReportItem
              name="seo-report-2024-11-01.html"
              date="2024-11-01"
              size="2.1 MB"
            />
            <ReportItem
              name="seo-report-2024-10-25.html"
              date="2024-10-25"
              size="2.0 MB"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: 'green' | 'yellow' | 'red'
}) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/50 text-green-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    red: 'bg-red-500/10 border-red-500/50 text-red-400',
  }

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 border`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold opacity-80">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}/100</p>
    </div>
  )
}

function SuggestionItem({ text, priority }: { text: string; priority: 'high' | 'medium' | 'low' }) {
  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${priorityColors[priority]}`} />
      <span className="text-sm">{text}</span>
    </div>
  )
}

function ReportItem({ name, date, size }: { name: string; date: string; size: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-400">{date} • {size}</div>
      </div>
      <a
        href={`/seo-reports/${name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all text-sm"
      >
        Ver
      </a>
    </div>
  )
}

