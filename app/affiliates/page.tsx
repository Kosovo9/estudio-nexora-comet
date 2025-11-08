'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Copy, CheckCircle2, TrendingUp, DollarSign, Users, Share2 } from 'lucide-react'
import { getTexts, type Language } from '@/lib/i18n'

export default function AffiliatesPage() {
  const { user, isLoaded } = useUser()
  const [language, setLanguage] = useState<Language>('en')
  const texts = getTexts(language)
  const [refLink, setRefLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    conversionRate: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    if (isLoaded && user) {
      const link = `https://studio-nexora.com/?ref=${user.id}`
      setRefLink(link)
      fetchAffiliateStats()
    }
  }, [isLoaded, user])

  const fetchAffiliateStats = async () => {
    try {
      const response = await fetch('/api/affiliates/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setRecentActivity(data.recentActivity || [])
      }
    } catch (error) {
      console.error('Error fetching affiliate stats:', error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(refLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Studio Nexora Comet - AI Photo Studio',
          text: 'Transform your photos with AI-powered studio styles',
          url: refLink,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      copyToClipboard()
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
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-400">Please sign in to access the affiliate program</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Affiliate Program
          </h1>
          <p className="text-gray-400">
            Share your link and earn <span className="font-bold text-green-400">20%</span> commission on every sale or photo generation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Referrals"
            value={stats.totalReferrals}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Pending Earnings"
            value={`$${stats.pendingEarnings.toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Referral Link Section */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={refLink}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={shareLink}
              className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-all flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Share this link with friends, family, or on social media. You&apos;ll earn 20% commission on every successful transaction.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="font-semibold mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-400">
                Copy and share your unique referral link with others
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-400">2</span>
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-sm text-gray-400">
                When someone signs up or makes a purchase using your link
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="font-semibold mb-2">You Earn</h3>
              <p className="text-sm text-gray-400">
                You automatically earn 20% commission on every transaction
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-semibold">{activity.type}</p>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+${activity.amount?.toFixed(2) || '0.00'}</p>
                    <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
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
    yellow: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
    purple: 'bg-purple-500/10 border-purple-500/50 text-purple-400',
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

