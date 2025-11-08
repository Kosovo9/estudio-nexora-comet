'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { BarChart3, TrendingUp, AlertCircle, Users, Clock, Download } from 'lucide-react'
import AdminPanelButtons from '@/components/AdminPanelButtons'
import AdminLogs from '@/components/AdminLogs'
import TeamChecklist from '@/components/TeamChecklist'
import { getLanguage } from '@/lib/i18n'

interface Metrics {
  totalGenerations: number
  successfulGenerations: number
  failedGenerations: number
  averageTime: number
  totalUsers: number
  blockingDetections: number
  conversions: number
  errors: number
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [language, setLanguage] = useState<'en' | 'es'>('en')

  useEffect(() => {
    if (isLoaded && user) {
      setLanguage(getLanguage())
      fetchMetrics()
    }
  }, [isLoaded, user, dateRange])

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/admin/metrics?range=${dateRange}`)
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportLogs = async (format: 'pdf' | 'csv') => {
    try {
      const response = await fetch(`/api/admin/export?format=${format}&range=${dateRange}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nexora-logs-${dateRange}-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting logs:', error)
      alert('Error exporting logs')
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // Simple admin check (in production, use proper role-based access)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access admin dashboard</p>
        </div>
      </div>
    )
  }

  if (loading || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading metrics...</div>
      </div>
    )
  }

  const successRate = metrics.totalGenerations > 0
    ? ((metrics.successfulGenerations / metrics.totalGenerations) * 100).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Admin Panel Buttons */}
        <div className="mb-6">
          <AdminPanelButtons language={language} />
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={() => exportLogs('csv')}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportLogs('pdf')}
              className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Generations"
            value={metrics.totalGenerations}
            icon={<BarChart3 className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <MetricCard
            title="Blocking Detections"
            value={metrics.blockingDetections}
            icon={<AlertCircle className="w-6 h-6" />}
            color="red"
          />
          <MetricCard
            title="Average Time"
            value={`${metrics.averageTime.toFixed(1)}s`}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <MetricCard
            title="Total Users"
            value={metrics.totalUsers}
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard
            title="Conversions"
            value={metrics.conversions}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <MetricCard
            title="Errors"
            value={metrics.errors}
            icon={<AlertCircle className="w-6 h-6" />}
            color="red"
          />
          <MetricCard
            title="Failed Generations"
            value={metrics.failedGenerations}
            icon={<AlertCircle className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Generation Trends</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              Chart placeholder - Integrate with react-chartjs-2
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Error Distribution</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              Pie chart placeholder - Integrate with react-chartjs-2
            </div>
          </div>
        </div>

            {/* Admin Logs */}
            <div className="mb-8">
              <AdminLogs />
            </div>

            {/* Team Checklist */}
            <div className="mb-8">
              <TeamChecklist
                items={[
                  language === 'es' ? 'QA tests pasaron' : 'QA tests passed',
                  'npm run build OK',
                  language === 'es' ? 'Logs sin error' : 'Logs without errors',
                  language === 'es' ? 'Copilot activo' : 'Copilot active',
                  language === 'es' ? 'Widgets flotantes funcionan' : 'Floating widgets working',
                  language === 'es' ? 'Onboarding modal aparece' : 'Onboarding modal appears',
                ]}
                lang={language}
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'es' ? 'Actividad Reciente' : 'Recent Activity'}
              </h2>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">
                  {language === 'es'
                    ? 'Feed de actividad en tiempo real'
                    : 'Real-time activity feed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
    green: 'bg-green-500/10 border-green-500/50 text-green-400',
    red: 'bg-red-500/10 border-red-500/50 text-red-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    purple: 'bg-purple-500/10 border-purple-500/50 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/50 text-orange-400',
  }

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-lg p-6 border`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold opacity-80">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

