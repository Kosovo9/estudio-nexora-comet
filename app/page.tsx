'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const PRICING = [
  { id: 1, fotos: 1, precio: '$200', desc: 'Esencial' },
  { id: 2, fotos: 2, precio: '$350', desc: 'Profesional', popular: true },
  { id: 3, fotos: 3, precio: '$500', desc: 'Premium' },
  { id: 4, fotos: 10, precio: '$1,000', desc: 'Enterprise' },
]

const STEPS = {
  es: ['Subir', 'Consentimiento', 'Estilo', 'Generar', 'Revisar', 'Pagar'],
  en: ['Upload', 'Consent', 'Style', 'Generate', 'Preview', 'Payment'],
}

export default function StudioNexoraCometLuxury() {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [currentStep, setCurrentStep] = useState(0)
  const [darkMode, setDarkMode] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedStyle, setSelectedStyle] = useState('Realista')
  const [isGenerating, setIsGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // === THREE.JS EARTH 3D ===
  useEffect(() => {
    if (!mountRef.current || !darkMode) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 2.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // === EARTH TEXTURE ===
    const canvas = document.createElement('canvas')
    canvas.width = 4096
    canvas.height = 2048
    const ctx = canvas.getContext('2d')!

    // Base ocean
    ctx.fillStyle = '#1a4d7a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Gradient ocean to land
    for (let x = 0; x < canvas.width; x += 4) {
      for (let y = 0; y < canvas.height; y += 4) {
        const noise = Math.sin(x * 0.001) * Math.cos(y * 0.002)
        if (noise > 0.5) {
          ctx.fillStyle = '#2e7aa9'
        } else if (noise > 0.3) {
          ctx.fillStyle = '#1a7f3a'
        } else if (noise > 0.1) {
          ctx.fillStyle = '#3a5f2a'
        } else {
          ctx.fillStyle = '#4a3f1a'
        }
        ctx.fillRect(x, y, 4, 4)
      }
    }

    // Add clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const r = Math.random() * 80 + 30
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    const geometry = new THREE.SphereGeometry(1, 256, 256)
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 5,
    })
    const earth = new THREE.Mesh(geometry, material)
    scene.add(earth)

    // === ATMOSPHERE ===
    const atmosphereGeo = new THREE.SphereGeometry(1.02, 256, 256)
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
    scene.add(atmosphere)

    // === LIGHTS ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const sunLight = new THREE.PointLight(0xffffff, 1.8)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    // === STARS ===
    const starsGeo = new THREE.BufferGeometry()
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      sizeAttenuation: true,
    })

    const starsVertices = []
    for (let i = 0; i < 3000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      )
    }

    starsGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(starsVertices), 3)
    )
    const stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)

    // === ANIMATION ===
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      earth.rotation.y += 0.0002
      atmosphere.rotation.y -= 0.00008
      renderer.render(scene, camera)
    }
    animate()

    // === RESIZE ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      atmosphereMat.dispose()
      starsMat.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [darkMode])

  const t = {
    es: {
      title: 'Studio Nexora Comet',
      sub: 'Estudio IA Profesional',
      desc: 'Tecnología de IA para editar fotos como profesional',
      start: 'Comenzar Ahora',
      plans: 'Planes Simples',
      features: 'Tecnología Premium',
      choose: 'Elegir',
      upload: 'Arrastra fotos aquí',
      uploadHint: 'JPG, PNG, WebP • Máx 10MB • Min 3 imágenes',
      consent: 'Acepto términos y condiciones',
      consentAI: 'Autorizo usar fotos para mejorar IA',
      selectStyle: 'Elige tu estilo',
      generating: 'Generando...',
      preview: 'Vista previa',
      payment: 'Selecciona tu plan',
      next: 'Siguiente',
      prev: 'Atrás',
      skip: 'Omitir',
    },
    en: {
      title: 'Studio Nexora Comet',
      sub: 'Professional AI Studio',
      desc: 'AI technology to edit photos like a pro',
      start: 'Start Now',
      plans: 'Simple Plans',
      features: 'Premium Technology',
      choose: 'Choose',
      upload: 'Drag photos here',
      uploadHint: 'JPG, PNG, WebP • Max 10MB • Min 3 images',
      consent: 'I accept terms and conditions',
      consentAI: 'Allow AI training with my photos',
      selectStyle: 'Choose your style',
      generating: 'Generating...',
      preview: 'Preview',
      payment: 'Select your plan',
      next: 'Next',
      prev: 'Back',
      skip: 'Skip',
    },
  }

  const texts = t[lang]
  const steps = STEPS[lang]

  // === FILE HANDLERS ===
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length >= 3) setUploadedFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    if (files.length >= 3) setUploadedFiles(files)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 3000))
    setIsGenerating(false)
    setCurrentStep(4)
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* EARTH BACKGROUND */}
      <div
        ref={mountRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="backdrop-blur-2xl bg-black/40 border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {texts.title}
                </span>
              </h1>
              <p className="text-xs text-white/40 mt-1">{texts.sub}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-all hover:text-white"
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 flex flex-col">
          {currentStep === 0 ? (
            // === LANDING ===
            <div className="flex-1 flex items-center justify-center px-6 md:px-12 py-20">
              <div className="max-w-4xl text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                    <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
                      {lang === 'es' ? 'Transforma tus Fotos' : 'Transform Your Photos'}
                    </span>
                  </h2>
                  <p className="text-xl text-white/60 max-w-2xl mx-auto">
                    {texts.desc}
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-block px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all"
                >
                  {texts.start} →
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                  {[
                    { icon: '🤖', title: 'IA Avanzada', desc: 'Hugging Face + Google' },
                    { icon: '⚡', title: 'Rápido', desc: '<5 segundos' },
                    { icon: '🎨', title: '50+ Estilos', desc: 'Profesional' },
                  ].map((feat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                      <div className="text-4xl mb-3">{feat.icon}</div>
                      <h4 className="font-bold text-white mb-1">{feat.title}</h4>
                      <p className="text-white/60 text-sm">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // === WORKFLOW ===
            <div className="flex-1 flex flex-col px-6 md:px-12 py-12">
              {/* PROGRESS */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i + 1)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      currentStep === i + 1
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : currentStep > i + 1
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/50'
                    }`}
                  >
                    {currentStep > i + 1 ? '✓' : i + 1}. {step}
                  </button>
                ))}
              </div>

              {/* STEP 1: UPLOAD */}
              {currentStep === 1 && (
                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-12 md:p-20 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-purple-400 bg-purple-500/10'
                        : 'border-white/20 hover:border-purple-500 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-6xl md:text-8xl mb-4">📸</div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{texts.upload}</h3>
                    <p className="text-white/60 text-sm">{texts.uploadHint}</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploadedFiles.length > 0 && (
                    <div className="mt-8 w-full">
                      <p className="text-green-400 font-semibold mb-4">✓ {uploadedFiles.length} imágenes cargadas</p>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="aspect-square rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">
                            ✓
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: CONSENT */}
              {currentStep === 2 && (
                <div className="flex-1 flex flex-col items-center justify-center max-w-md">
                  <h3 className="text-2xl font-bold mb-8">✓ {lang === 'es' ? 'Consentimiento' : 'Consent'}</h3>
                  <div className="space-y-4 w-full">
                    <label className="flex gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1" />
                      <span className="text-white/80">{texts.consent}</span>
                    </label>
                    <label className="flex gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1" />
                      <span className="text-white/80">{texts.consentAI}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: STYLE */}
              {currentStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center max-w-3xl">
                  <h3 className="text-2xl font-bold mb-8">🎨 {texts.selectStyle}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {['Realista', 'Artístico', 'Cartoon', 'Cinematic', 'Pixelado', 'Hiper'].map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          setSelectedStyle(style)
                          setCurrentStep(4)
                        }}
                        className={`p-6 rounded-lg font-semibold transition-all hover:scale-105 ${
                          selectedStyle === style
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
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
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold mb-8">⚡ {lang === 'es' ? 'Generando' : 'Generating'}</h3>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
                      isGenerating
                        ? 'opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        {texts.generating}
                      </>
                    ) : (
                      `${lang === 'es' ? 'Generar' : 'Generate'} ${selectedStyle}`
                    )}
                  </button>
                </div>
              )}

              {/* STEP 5: PREVIEW */}
              {currentStep === 5 && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold mb-8">👁️ {texts.preview}</h3>
                  <div className="w-full max-w-md aspect-square rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center text-6xl">
                    🖼️
                  </div>
                </div>
              )}

              {/* STEP 6: PAYMENT */}
              {currentStep === 6 && (
                <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
                  <h3 className="text-2xl font-bold mb-8">💳 {texts.payment}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {PRICING.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => alert(`${lang === 'es' ? 'Comprado: ' : 'Purchased: '}${plan.precio}`)}
                        className={`p-6 rounded-xl transition-all hover:scale-105 ${
                          plan.popular
                            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        {plan.popular && <div className="text-xs bg-purple-400 text-black px-2 py-1 rounded mb-3 inline-block">⭐ POPULAR</div>}
                        <div className="text-3xl font-bold text-white">{plan.precio}</div>
                        <div className="text-white/60 text-sm mt-2">{plan.fotos} {lang === 'es' ? 'Fotos' : 'Photos'}</div>
                        <div className="text-white/80 text-xs mt-1">{plan.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTROLS */}
              <div className="flex gap-4 justify-center mt-12">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    currentStep === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  ← {texts.prev}
                </button>

                {currentStep < 6 && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    {texts.next} →
                  </button>
                )}

                {currentStep === 0 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    {texts.start} →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="backdrop-blur-xl bg-black/60 border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-center">
            <p className="text-white/40 text-sm">© 2025 Studio Nexora Comet • Made with ❤️</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
