'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import PhotoUpload from '@/components/PhotoUpload'
import ConsentForm from '@/components/ConsentForm'
import StyleSelector from '@/components/StyleSelector'
import WatermarkPreview from '@/components/WatermarkPreview'
import PaymentForm from '@/components/PaymentForm'
import { generateAI } from '@/lib/ai'

export type Style = 'dark-studio' | 'paris-cafe'

export default function Home() {
  const { user, isLoaded } = useUser()
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<File[]>([])
  const [consentGiven, setConsentGiven] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  const handleImagesUploaded = (uploadedImages: File[]) => {
    setImages(uploadedImages)
    if (uploadedImages.length >= 3) {
      setStep(2)
    }
  }

  const handleConsentSubmit = () => {
    setConsentGiven(true)
    setStep(3)
  }

  const handleStyleSelect = (style: Style) => {
    setSelectedStyle(style)
    setStep(4)
  }

  const handleGenerate = async () => {
    if (!selectedStyle || images.length < 3) return

    setIsGenerating(true)
    try {
      const result = await generateAI(images, selectedStyle)
      setGeneratedImage(result)
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Studio Nexora Comet
          </h1>
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
                <span>Upload</span>
                <span>Consent</span>
                <span>Style</span>
                <span>Generate</span>
                <span>Preview</span>
                <span>Payment</span>
              </div>
            </div>

            {/* Step Content */}
            {step === 1 && (
              <PhotoUpload
                onUpload={handleImagesUploaded}
                minImages={3}
              />
            )}

            {step === 2 && (
              <ConsentForm onSubmit={handleConsentSubmit} />
            )}

            {step === 3 && (
              <StyleSelector
                onSelect={handleStyleSelect}
                selectedStyle={selectedStyle}
              />
            )}

            {step === 4 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Generate</h2>
                <p className="text-gray-400 mb-6">
                  Style: {selectedStyle === 'dark-studio' ? 'Dark Studio' : 'Paris Café'}
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Image'}
                </button>
              </div>
            )}

            {step === 5 && generatedImage && (
              <WatermarkPreview
                imageUrl={generatedImage}
                onContinue={() => setStep(6)}
              />
            )}

            {step === 6 && (
              <PaymentForm
                onComplete={handlePaymentComplete}
                imageUrl={generatedImage}
              />
            )}

            {paymentCompleted && (
              <div className="text-center mt-8">
                <div className="text-green-400 text-2xl mb-4">✓ Payment Complete!</div>
                <a
                  href={generatedImage || '#'}
                  download
                  className="px-8 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-all inline-block"
                >
                  Download Without Watermark
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

