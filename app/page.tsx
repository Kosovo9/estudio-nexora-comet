'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Upload, ChevronRight, ChevronLeft, Menu, X, FileText, Heart, Share2, Settings, Home, Mail, Phone } from 'lucide-react'

const STEPS = ['Subir', 'Consentimiento', 'Estilo', 'Generar', 'Revisar', 'Pagar']
const STEPS_EN = ['Upload', 'Consent', 'Style', 'Generate', 'Preview', 'Payment']
const STYLES = ['Realista', 'Artístico', 'Cartoon', 'Cinematic', 'Pixelado', 'Hiperrealista']
const PRICING = [
  { id: 1, fotos: 1, precio: 200 },
  { id: 2, fotos: 2, precio: 350 },
  { id: 3, fotos: 3, precio: 500 },
  { id: 4, fotos: 10, precio: 1000 },
]

export default function StudioNexoraPremium() {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [currentStep, setCurrentStep] = useState(1)
  const [darkMode, setDarkMode] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedStyle, setSelectedStyle] = useState('Realista')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const texts = {
    es: {
      title: 'Studio Nexora Comet',
      subtitle: 'Estudio de Fotos con IA',
      upload: 'Arrastra tus fotos aquí o haz clic',
      uploadHint: 'JPG, PNG, WebP • Máx 10MB • Min 3 imágenes',
      consent: 'Consentimiento',
      style: 'Elige Estilo',
      generate: 'Generar',
      preview: 'Revisar',
      payment: 'Pagar',
      next: 'Siguiente',
      prev: 'Atrás',
      footer_about: 'Acerca de',
      footer_support: 'Soporte',
      footer_legal: 'Legal',
      footer_privacy: 'Privacidad',
      footer_contact: 'Contacto',
    },
    en: {
      title: 'Studio Nexora Comet',
      subtitle: 'AI-Powered Photo Studio',
      upload: 'Drag your photos here or click',
      uploadHint: 'JPG, PNG, WebP • Max 10MB • Min 3 images',
      consent: 'Consent',
      style: 'Choose Style',
      generate: 'Generate',
      preview: 'Preview',
      payment: 'Payment',
      next: 'Next',
      prev: 'Back',
      footer_about: 'About',
      footer_support: 'Support',
      footer_legal: 'Legal',
      footer_privacy: 'Privacy',
      footer_contact: 'Contact',
    },
  }

  const t = texts[lang]
  const steps = lang === 'es' ? STEPS : STEPS_EN

  // Toast handler
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Dark mode persistence
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      setDarkMode(JSON.parse(saved))
    }
  }, [])

  // File handling
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length < 3) {
      setToast({ message: lang === 'es' ? 'Mín 3 imágenes requeridas' : 'Min 3 images required', type: 'error' })
      return
    }
    setUploadedFiles(files)
    setToast({ message: lang === 'es' ? '✓ Fotos cargadas' : '✓ Photos uploaded', type: 'success' })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    if (files.length < 3) {
      setToast({ message: lang === 'es' ? 'Mín 3 imágenes' : 'Min 3 images', type: 'error' })
      return
    }
    setUploadedFiles(files)
    setToast({ message: lang === 'es' ? '✓ Fotos cargadas' : '✓ Photos uploaded', type: 'success' })
  }

  // Simulate generation
  const handleGenerate = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 3000))
    setIsLoading(false)
    setToast({ message: lang === 'es' ? '✓ Generación completada' : '✓ Generation complete', type: 'success' })
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('darkMode', JSON.stringify(!darkMode))
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 text-white'
        : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900'
    }`}>
      {/* HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        darkMode
          ? 'bg-indigo-950/80 border-b border-purple-500/20'
          : 'bg-white/80 border-b border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t.title}
          </h1>

          <div className="hidden md:flex gap-4 items-center">
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              🌐 {lang === 'es' ? 'EN' : 'ES'}
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                darkMode
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`md:hidden p-4 flex gap-3 flex-col ${
            darkMode ? 'bg-indigo-900/50' : 'bg-slate-100'
          }`}>
            <button
              onClick={() => {
                setLang(lang === 'es' ? 'en' : 'es')
                setShowMobileMenu(false)
              }}
              className={`px-4 py-2 rounded-lg font-semibold ${
                darkMode
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              🌐 {lang === 'es' ? 'English' : 'Español'}
            </button>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg font-semibold ${
                darkMode
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* HERO */}
        <div className="text-center mb-12">
          <h2 className="font-black text-3xl md:text-5xl mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className={`text-lg md:text-xl mb-2 ${darkMode ? 'text-purple-200' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
          <p className={`text-sm md:text-base ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'es'
              ? 'Transforma tus fotos con IA. Edición profesional, marketplace y afiliados.'
              : 'Transform your photos with AI. Professional editing, marketplace & affiliates.'}
          </p>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="fixed top-20 right-4 md:right-8 flex flex-col items-center gap-2">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full backdrop-blur-sm flex items-center justify-center font-bold text-lg md:text-xl transition-all ${
            darkMode
              ? 'bg-purple-500/30 border-2 border-purple-400 text-purple-200'
              : 'bg-purple-200/50 border-2 border-purple-400 text-purple-700'
          }`}>
            <span>{currentStep}</span>
            <span className="text-xs absolute -bottom-6">{currentStep}/6</span>
          </div>
        </div>

        {/* STEPS NAVBAR */}
        <div className="mb-8 flex gap-2 md:gap-3 overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx + 1)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all whitespace-nowrap hover:scale-105 ${
                currentStep === idx + 1
                  ? `${darkMode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  } border-2 border-transparent`
                  : `${darkMode
                    ? 'bg-slate-800/50 text-slate-300 border-2 border-slate-700'
                    : 'bg-slate-200 text-slate-600 border-2 border-slate-300'
                  }`
              }`}
            >
              <span className={currentStep > idx + 1 ? '✓' : String(idx + 1)}> </span> {step}
            </button>
          ))}
        </div>

        {/* STEP CONTENT */}
        <div className={`rounded-2xl p-8 md:p-12 mb-8 transition-all ${
          darkMode
            ? 'bg-slate-900/50 border border-purple-500/20 backdrop-blur-sm'
            : 'bg-white/50 border border-slate-200 backdrop-blur-sm'
        }`}>
          {/* STEP 1: UPLOAD */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">📸 {t.upload}</h3>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 md:p-16 text-center cursor-pointer transition-all ${
                  dragActive
                    ? darkMode
                      ? 'border-purple-400 bg-purple-500/10'
                      : 'border-purple-500 bg-purple-100'
                    : darkMode
                    ? 'border-slate-600 hover:border-purple-500 hover:bg-purple-500/5'
                    : 'border-slate-300 hover:border-purple-500 hover:bg-purple-50'
                } ${dragActive ? 'animate-pulse' : ''}`}
              >
                <div className="text-6xl mb-4">⬆️</div>
                <p className="text-lg md:text-xl font-semibold mb-2">{t.upload}</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.uploadHint}
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <p className="font-semibold mb-4">{uploadedFiles.length} {lang === 'es' ? 'imágenes cargadas' : 'images uploaded'}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className={`rounded-lg p-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className={`text-center py-4 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'} rounded`}>
                          📄 {file.name.substring(0, 12)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CONSENT */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">✓ {t.consent}</h3>
              <div className="space-y-4 max-w-md mx-auto">
                <label className={`flex gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                  darkMode
                    ? 'bg-purple-500/10 hover:bg-purple-500/20'
                    : 'bg-purple-100 hover:bg-purple-200'
                }`}>
                  <input type="checkbox" defaultChecked className="mt-1" />
                  <span>{lang === 'es' ? 'Acepto términos y condiciones' : 'I accept terms & conditions'}</span>
                </label>
                <label className={`flex gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                  darkMode
                    ? 'bg-purple-500/10 hover:bg-purple-500/20'
                    : 'bg-purple-100 hover:bg-purple-200'
                }`}>
                  <input type="checkbox" defaultChecked className="mt-1" />
                  <span>{lang === 'es' ? 'Autorizo usar fotos para mejorar IA' : 'Allow AI training with photos'}</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: STYLE */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">🎨 {t.style}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-4 rounded-lg font-semibold transition-all hover:scale-105 ${
                      selectedStyle === style
                        ? `${darkMode
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        } shadow-lg`
                        : `${darkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: GENERATE */}
          {currentStep === 4 && (
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">⚡ {t.generate}</h3>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    {lang === 'es' ? 'Generando...' : 'Generating...'}
                  </>
                ) : (
                  t.generate
                )}
              </button>
            </div>
          )}

          {/* STEP 5: PREVIEW */}
          {currentStep === 5 && (
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">👁️ {t.preview}</h3>
              <div className={`w-full max-w-sm mx-auto aspect-square rounded-lg flex items-center justify-center text-6xl ${
                darkMode ? 'bg-slate-800' : 'bg-slate-200'
              }`}>
                🖼️
              </div>
            </div>
          )}

          {/* STEP 6: PAYMENT */}
          {currentStep === 6 && (
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">💳 {t.payment}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {PRICING.map((plan) => (
                  <button
                    key={plan.id}
                    className={`p-6 rounded-lg transition-all hover:scale-105 font-semibold ${
                      darkMode
                        ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 text-green-300 hover:border-green-400'
                        : 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 text-green-700 hover:border-green-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-lg">{plan.fotos} {lang === 'es' ? 'Fotos' : 'Photos'}</div>
                    <div className="text-2xl font-bold mt-2">${plan.precio} MXN</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex gap-4 justify-center mb-16">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
              currentStep === 1
                ? 'opacity-50 cursor-not-allowed'
                : darkMode
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-slate-300 text-slate-900 hover:bg-slate-400'
            }`}
          >
            ← {t.prev}
          </button>
          <button
            onClick={() => currentStep < 6 && setCurrentStep(currentStep + 1)}
            disabled={currentStep === 6}
            className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
              currentStep === 6
                ? 'opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
            }`}
          >
            {t.next} →
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`border-t ${
        darkMode
          ? 'bg-indigo-950/50 border-purple-500/20'
          : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">{lang === 'es' ? 'Producto' : 'Product'}</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footer_support}</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footer_legal}</h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><a href="#" className="hover:text-white transition">{t.footer_privacy}</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-2">
              <h4 className="font-bold mb-4">{t.footer_contact}</h4>
              <div className={`space-y-2 flex gap-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Mail size={20} />
                <Phone size={20} />
                <Heart size={20} />
              </div>
            </div>
          </div>

          <div className={`text-center pt-8 border-t ${
            darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-600'
          }`}>
            <p>© 2025 Studio Nexora Comet. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg font-semibold animate-bounce ${
          toast.type === 'success'
            ? darkMode
              ? 'bg-green-500/80 text-white'
              : 'bg-green-400 text-green-900'
            : darkMode
            ? 'bg-red-500/80 text-white'
            : 'bg-red-400 text-red-900'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
