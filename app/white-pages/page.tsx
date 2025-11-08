'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Palette, Globe, CreditCard, Settings, Eye, Download } from 'lucide-react'

export default function WhitePagesPage() {
  const { user, isLoaded } = useUser()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customization, setCustomization] = useState({
    brandName: '',
    brandColor: '#3b82f6',
    logo: '',
    contactEmail: '',
    seoTitle: '',
    seoDescription: '',
  })

  const templates = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design',
      preview: '🎨',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary and sleek',
      preview: '✨',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Business-focused design',
      preview: '💼',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and artistic',
      preview: '🎭',
    },
  ]

  const handleSave = async () => {
    // Save customization to database
    try {
      const response = await fetch('/api/white-pages/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          customization,
          userId: user?.id,
        }),
      })

      if (response.ok) {
        alert('Customization saved successfully!')
      }
    } catch (error) {
      console.error('Error saving customization:', error)
      alert('Failed to save customization')
    }
  }

  const handlePurchase = async () => {
    // Redirect to payment
    window.location.href = '/payment?type=white-page&template=' + selectedTemplate
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            White Pages Premium
          </h1>
          <p className="text-gray-400">
            Create, customize, and deploy your own branded landing page
          </p>
        </div>

        {/* Templates Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-6xl mb-4">{template.preview}</div>
                <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-400">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Customization Panel */}
        {selectedTemplate && (
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Settings className="w-6 h-6" />
              <span>Customization</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Brand Name</label>
                <input
                  type="text"
                  value={customization.brandName}
                  onChange={(e) => setCustomization({ ...customization, brandName: e.target.value })}
                  placeholder="Your Brand Name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>

              {/* Brand Color */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Brand Color</span>
                </label>
                <input
                  type="color"
                  value={customization.brandColor}
                  onChange={(e) => setCustomization({ ...customization, brandColor: e.target.value })}
                  className="w-full h-12 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">Logo URL</label>
                <input
                  type="url"
                  value={customization.logo}
                  onChange={(e) => setCustomization({ ...customization, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Contact Email</span>
                </label>
                <input
                  type="email"
                  value={customization.contactEmail}
                  onChange={(e) => setCustomization({ ...customization, contactEmail: e.target.value })}
                  placeholder="contact@yourbrand.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>

              {/* SEO Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">SEO Title</label>
                <input
                  type="text"
                  value={customization.seoTitle}
                  onChange={(e) => setCustomization({ ...customization, seoTitle: e.target.value })}
                  placeholder="Your SEO Title"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">SEO Description</label>
                <textarea
                  value={customization.seoDescription}
                  onChange={(e) => setCustomization({ ...customization, seoDescription: e.target.value })}
                  placeholder="Your SEO Description"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
            </div>

            {/* Preview Button */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => window.open(`/white-pages/preview?template=${selectedTemplate}`, '_blank')}
                className="px-6 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition-all flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        )}

        {/* Pricing & Purchase */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
            <CreditCard className="w-6 h-6" />
            <span>Pricing</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              name="Rent (Monthly)"
              price="$29"
              period="per month"
              features={['Custom domain', 'Full customization', 'SEO optimization', 'Analytics']}
              onPurchase={() => handlePurchase()}
            />
            <PricingCard
              name="Buy (One-time)"
              price="$299"
              period="one-time"
              features={['Custom domain', 'Full customization', 'SEO optimization', 'Analytics', 'Source code', 'Lifetime updates']}
              highlighted
              onPurchase={() => handlePurchase()}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period="contact us"
              features={['Everything in Buy', 'White-label', 'Multi-tenant', 'Priority support', 'Custom development']}
              onPurchase={() => window.location.href = 'mailto:sales@studio-nexora.com'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  features,
  highlighted = false,
  onPurchase,
}: {
  name: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
  onPurchase: () => void
}) {
  return (
    <div
      className={`p-6 rounded-lg border-2 ${
        highlighted
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 bg-gray-800/50'
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-400 text-sm ml-2">{period}</span>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-green-400">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onPurchase}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
          highlighted
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        Get Started
      </button>
    </div>
  )
}

