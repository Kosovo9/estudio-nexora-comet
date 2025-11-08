'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import PhotoUpload from '@/components/PhotoUpload'
import ConsentForm from '@/components/ConsentForm'
import StyleSelector from '@/components/StyleSelector'
import WatermarkPreview from '@/components/WatermarkPreview'
import PaymentForm from '@/components/PaymentForm'
import AIGeneration from '@/components/AIGeneration'
import { generateAI } from '@/lib/ai'
import { getLanguage, setLanguage, type Language, getTexts } from '@/lib/i18n'
import SchemaOrg from '@/components/SchemaOrg'
import FooterNexora from '@/components/FooterNexora'

export type Style = 'dark-studio' | 'paris-cafe'

export default function Home() {
  const { user, isLoaded } = useUser()
  const [language, setLanguageState] = useState<Language>('en')
  const texts = getTexts(language)
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<File[]>([])
  const [consentGiven, setConsentGiven] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  useEffect(() => {
    // Initialize language from URL or localStorage
    const lang = getLanguage()
    setLanguageState(lang)
  }, [])

  const handleImagesUploaded = (uploadedImages: File[]) => {
    setImages(uploadedImages)
    if (uploadedImages.length >= 3) {
      logStepProgress(2, 'Consent')
      setStep(2)
    }
  }

  const handleConsentSubmit = () => {
    setConsentGiven(true)
    logStepProgress(3, 'Style')
    setStep(3)
  }

  const handleStyleSelect = (style: Style) => {
    setSelectedStyle(style)
    logStepProgress(4, 'Generate')
    setStep(4)
  }

  const handleGenerate = async () => {
    if (!selectedStyle || images.length < 3) return

    setIsGenerating(true)
    try {
      const result = await generateAI(images, selectedStyle)
      setGeneratedImage(result)
      logStepProgress(5, 'Preview')
      setStep(5)
    } catch (error) {
      console.error('Generation error:', error)
      alert('Error generating image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePaymentComplete = () => {
    setPaymentCompleted(true)
    setStep(6)
  }

  const handleTemporaryDownload = async (imageUrl: string | null) => {
    if (!imageUrl) return

    try {
      // Save to temporary storage with 24h expiration
      const response = await fetch('/api/temp-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          expiresIn: 24 * 60 * 60, // 24 hours in seconds
        }),
      })

      const { downloadUrl } = await response.json()
      
      // Open download
      window.open(downloadUrl, '_blank')
    } catch (error) {
      console.error('Download error:', error)
      // Fallback: direct download
      window.open(imageUrl, '_blank')
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Studio Nexora Comet
          </h1>
          <p className="text-gray-300 mb-8">AI-Powered Photo Studio</p>
          <a
            href="/sign-in"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all inline-block"
          >
            Sign In to Continue
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <SchemaOrg
        type="WebSite"
        name="Studio Nexora Comet"
        url="https://studio-nexora.com"
        description="AI Photo Studio, edición imágenes, afiliados, marketplace."
        searchAction={true}
      />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* QA Progress Indicator */}
          <QAProgress currentStep={step} lang={language} />
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Studio Nexora Comet
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setLanguage('es')
                  setLanguageState('es')
                }}
                className={`px-3 py-1 rounded ${language === 'es' ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                ES
              </button>
              <button
                onClick={() => {
                  setLanguage('en')
                  setLanguageState('en')
                }}
                className={`px-3 py-1 rounded ${language === 'en' ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                EN
              </button>
            </div>
          </div>
          <p className="text-center text-gray-400 mb-8">AI-Powered Photo Studio</p>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step >= s
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {s}
                    </div>
                    {s < 6 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step > s ? 'bg-blue-500' : 'bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>{texts.uploadPhotos}</span>
                <span>{texts.consent}</span>
                <span>{texts.selectStyle}</span>
                <span>{texts.readyToGenerate}</span>
                <span>{texts.watermarkPreview}</span>
                <span>{texts.payment}</span>
              </div>
            </div>

            {/* Step Content */}
            {step === 1 && (
              <PhotoUpload
                onUpload={handleImagesUploaded}
                minImages={3}
                language={language}
              />
            )}

            {step === 2 && (
              <ConsentForm onSubmit={handleConsentSubmit} language={language} />
            )}

            {step === 3 && (
              <StyleSelector
                onSelect={handleStyleSelect}
                selectedStyle={selectedStyle}
                language={language}
              />
            )}

            {step === 4 && (
              <AIGeneration
                onGenerate={async () => {
                  if (!selectedStyle || images.length < 3) {
                    throw new Error('Missing required data')
                  }
                  const result = await generateAI(images, selectedStyle)
                  setGeneratedImage(result)
                  setStep(5)
                  return result
                }}
                selectedStyle={selectedStyle!}
                isReady={!isGenerating && selectedStyle !== null && images.length >= 3}
                language={language}
              />
            )}

            {step === 5 && generatedImage && (
              <WatermarkPreview
                imageUrl={generatedImage}
                onContinue={() => setStep(6)}
                language={language}
              />
            )}

            {step === 6 && (
              <PaymentForm
                onComplete={handlePaymentComplete}
                imageUrl={generatedImage}
                language={language}
              />
            )}

            {paymentCompleted && (
              <div className="text-center mt-8 space-y-4">
                <div className="text-green-400 text-2xl mb-4">
                  ✓ {language === 'es' ? '¡Pago Completado!' : 'Payment Complete!'}
                </div>
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-4">
                  <p className="text-blue-300 text-sm mb-2">
                    ⏰ {texts.downloadAvailable}
                  </p>
                  <p className="text-blue-400 text-xs">
                    {texts.downloadAvailableFull}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(texts.confirmDownload)) {
                      // Save to temporary storage with 24h TTL
                      handleTemporaryDownload(generatedImage)
                    }
                  }}
                  className="px-8 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-all inline-block"
                >
                  {texts.download}
                </button>
                <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 mt-4">
                  <p className="text-orange-300 text-xs">{texts.downloadDisclaimer}</p>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  {texts.needHelp} {texts.contactSupport}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterNexora lang={language} setLang={setLanguage} />
    </main>
  )
}

