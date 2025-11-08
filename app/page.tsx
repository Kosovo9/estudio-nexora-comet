'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FooterNexora from '@/components/FooterNexora'
import ChatAI247 from '@/components/ChatAI247'
import AdminPanelButtons from '@/components/AdminPanelButtons'
import QAProgress from '@/components/QAProgress'
import EarthPlanet from '@/components/EarthPlanet'
import Tooltips from '@/components/Tooltips'
import OnboardingModal from '@/components/OnboardingModal'
import CopilotWidget from '@/components/CopilotWidget'
import SchemaOrg from '@/components/SchemaOrg'

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const savedLanguage = (localStorage.getItem('language') || 'en') as 'en' | 'es'
    setLanguage(savedLanguage)

    const hasSeenOnboarding = localStorage.getItem('onboarding-seen')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const content = {
    en: {
      title: 'Studio Nexora Comet',
      subtitle: 'AI-Powered Photo Studio',
      description: 'Transform your photos with AI. Professional editing, marketplace, and affiliate network.',
    },
    es: {
      title: 'Studio Nexora Comet',
      subtitle: 'Estudio de Fotos con IA',
      description: 'Transforma tus fotos con IA. Edición profesional, marketplace y red de afiliados.',
    },
  }

  const texts = content[language as keyof typeof content] || content.en

  return (
    <>
      {/* Schema.org Structured Data */}
      <SchemaOrg
        type="WebSite"
        name="Studio Nexora Comet"
        description="AI Photo Studio, edición imágenes, afiliados, marketplace."
        searchAction={true}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navbar language={language} onLanguageChange={handleLanguageChange} />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* QA Progress Indicator */}
            <QAProgress currentStep={1} lang={language as 'en' | 'es'} />

            {/* Hero Section */}
            <section className="py-12 text-center">
              <Hero language={language} />
            </section>

            {/* Earth Planet (if not mobile) */}
            {!isMobile && (
              <section className="py-8 flex justify-center">
                <div className="w-64 h-64">
                  <EarthPlanet language={language} />
                </div>
              </section>
            )}

            {/* Admin Panel Buttons */}
            <section className="py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <AdminPanelButtons language={language} />
            </section>

            {/* Tooltips Context */}
            <section className="py-8">
              <Tooltips language={language} />
            </section>

            {/* Call to Action */}
            <section className="py-12 text-center">
              <p className="text-lg text-gray-300 mb-6">
                {language === 'en'
                  ? 'Start your AI photo transformation journey today.'
                  : 'Comienza tu viaje de transformación de fotos con IA hoy.'}
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition">
                {language === 'en' ? 'Get Started' : 'Comenzar'}
              </button>
            </section>
          </div>
        </div>

        {/* Floating Widgets */}
        <ChatAI247 lang={language as 'en' | 'es'} />
        <CopilotWidget user={{ lang: language }} />

        {/* Footer */}
        <FooterNexora lang={language as 'en' | 'es'} setLang={handleLanguageChange} />

        {/* Onboarding Modal */}
        {showOnboarding && (
          <OnboardingModal
            lang={language as 'en' | 'es'}
            onClose={() => {
              setShowOnboarding(false)
              localStorage.setItem('onboarding-seen', 'true')
            }}
          />
        )}
      </main>
    </>
  )
}
