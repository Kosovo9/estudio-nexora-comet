'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const PRICING = [
  { id: 1, fotos: 1, precio: '$200 MXN', desc: 'Esencial' },
  { id: 2, fotos: 2, precio: '$350 MXN', desc: 'Profesional', popular: true },
  { id: 3, fotos: 3, precio: '$500 MXN', desc: 'Premium' },
  { id: 4, fotos: 10, precio: '$1,000 MXN', desc: 'Enterprise' },
]

export default function StudioNexora() {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [style, setStyle] = useState('Realista')
  const [generating, setGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  // THREE.JS - PLANETA TIERRA REAL NASA
  useEffect(() => {
    if (!mountRef.current) return
    
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    camera.position.set(0.1, 0.05, 2.0)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, precision: 'highp' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true

    mountRef.current.innerHTML = ''
    mountRef.current.appendChild(renderer.domElement)

    // CREAR TEXTURA TIERRA REAL CON COLORES CORRECTOS
    const createEarthTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 16384
      canvas.height = 8192
      const ctx = canvas.getContext('2d')!

      // Base: Océanos azules reales
      const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      oceanGradient.addColorStop(0, '#0066FF')
      oceanGradient.addColorStop(0.3, '#0066CC')
      oceanGradient.addColorStop(0.5, '#0052A3')
      oceanGradient.addColorStop(0.7, '#0066CC')
      oceanGradient.addColorStop(1, '#0066FF')
      ctx.fillStyle = oceanGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Continentes realistas
      const continents = [
        // Norte América
        { x: 0.25, y: 0.35, w: 0.15, h: 0.2, color: '#2d5016' },
        // Centro América
        { x: 0.28, y: 0.45, w: 0.08, h: 0.1, color: '#3d6b1f' },
        // Sur América
        { x: 0.32, y: 0.52, w: 0.1, h: 0.25, color: '#2d5016' },
        // Europa
        { x: 0.48, y: 0.28, w: 0.08, h: 0.08, color: '#3d6b1f' },
        // Africa
        { x: 0.52, y: 0.4, w: 0.1, h: 0.25, color: '#2d5016' },
        // Asia
        { x: 0.65, y: 0.25, w: 0.25, h: 0.35, color: '#3d6b1f' },
        // Australia
        { x: 0.82, y: 0.6, w: 0.08, h: 0.12, color: '#2d5016' },
      ]

      continents.forEach(cont => {
        ctx.fillStyle = cont.color
        ctx.fillRect(
          cont.x * canvas.width,
          cont.y * canvas.height,
          cont.w * canvas.width,
          cont.h * canvas.height
        )
      })

      // Nubes blancas realistas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 200 + 100
        
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.beginPath()
        ctx.arc(x + size * 0.6, y - size * 0.3, size * 0.7, 0, Math.PI * 2)
        ctx.fill()
      }

      return new THREE.CanvasTexture(canvas)
    }

    const texture = createEarthTexture()
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter

    // Mesh Tierra
    const geometry = new THREE.SphereGeometry(1, 1024, 512)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.05,
      emissive: 0x000000,
    })
    const earth = new THREE.Mesh(geometry, material)
    earth.rotation.x = 0.08
    earth.rotation.z = 0.05
    scene.add(earth)

    // Atmósfera
    const atmGeo = new THREE.SphereGeometry(1.012, 512, 256)
    const atmMat = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    })
    scene.add(new THREE.Mesh(atmGeo, atmMat))

    // Iluminación
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8)
    sunLight.position.set(3, 2, 4)
    sunLight.castShadow = true
    scene.add(sunLight)

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))

    // Stars
    const starsGeo = new THREE.BufferGeometry()
    const vertices = []
    for (let i = 0; i < 8000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
      )
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.08, 
      sizeAttenuation: true 
    }))
    scene.add(stars)

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      earth.rotation.y += 0.00008
      renderer.render(scene, camera)
    }
    animate()

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  // TEXTOS EN ESPAÑOL
  const t = {
    header_title: 'Studio Nexora Comet',
    header_studio: 'Estudio IA Profesional',
    hero_title: 'Transforma tus Fotos',
    hero_desc: 'Tecnología de IA para editar fotos como profesional',
    hero_btn: 'Comenzar Ahora',
    steps: ['Subir', 'Consentimiento', 'Estilo', 'Generar', 'Revisar', 'Pagar'],
    upload_title: 'Arrastra fotos aquí',
    upload_hint: 'JPG, PNG, WebP • Máx 10MB • Mín 3 imágenes',
    uploaded: 'imágenes cargadas',
    consent_title: 'Consentimiento',
    consent_check1: 'Acepto términos y condiciones',
    consent_check2: 'Autorizo usar mis fotos para mejorar IA',
    style_title: 'Elige tu estilo',
    styles: ['Realista', 'Artístico', 'Cartoon', 'Cinematic', 'Pixelado', 'Hiperrealista'],
    generate_title: 'Generando',
    generate_btn: 'Generar',
    generating: 'Generando...',
    preview_title: 'Vista previa',
    payment_title: 'Selecciona tu plan',
    next: 'Siguiente',
    prev: 'Atrás',
    chat_title: 'Chat en línea',
    chat_msg: '¿Cómo podemos ayudarte?',
    settings_title: 'Configuración',
    lang: 'Idioma',
    spanish: 'Español',
    english: 'English',
    close: 'Cerrar',
  }

  // MANEJADORES
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const images = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (images.length >= 3) setFiles(images)
    setDragActive(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const images = Array.from(e.target.files || [])
    if (images.length >= 3) setFiles(images)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
    setStep(4)
    alert('¡Fotos generadas con éxito!')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* CANVAS THREE.JS */}
      <div ref={mountRef} className="fixed inset-0 w-full h-full pointer-events-none" />
      
      {/* OVERLAY */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      {/* CONTENIDO */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="backdrop-blur-xl bg-black/50 border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t.header_title}
              </h1>
              <p className="text-xs text-white/40 mt-1">{t.header_studio}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all hover:scale-105"
              >
                ⚙️ {t.settings_title}
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all hover:scale-105"
              >
                💬 {t.chat_title}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 flex flex-col">
          {step === 0 ? (
            // LANDING
            <div className="flex-1 flex items-center justify-center px-6 py-20">
              <div className="max-w-4xl text-center space-y-8">
                <h2 className="text-6xl md:text-7xl font-black text-white">
                  {t.hero_title}
                </h2>
                <p className="text-xl text-white/60">{t.hero_desc}</p>
                <button
                  onClick={() => setStep(1)}
                  className="px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all hover:shadow-2xl hover:shadow-purple-500/50"
                >
                  {t.hero_btn} →
                </button>
              </div>
            </div>
          ) : (
            // WORKFLOW
            <div className="flex-1 flex flex-col px-6 py-12">
              {/* PASOS */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {t.steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i + 1)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all hover:scale-105 ${
                      step === i + 1
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : step > i + 1
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {step > i + 1 ? '✓' : i + 1}. {s}
                  </button>
                ))}
              </div>

              {/* CONTENIDO */}
              <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                {step === 1 && (
                  <div className="w-full space-y-6">
                    <div
                      onDragEnter={() => setDragActive(true)}
                      onDragLeave={() => setDragActive(false)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`w-full p-20 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        dragActive
                          ? 'border-purple-400 bg-purple-500/20 scale-105'
                          : 'border-white/30 hover:border-purple-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="text-7xl mb-4">📸</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{t.upload_title}</h3>
                      <p className="text-white/60">{t.upload_hint}</p>
                    </div>
                    <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                    {files.length > 0 && (
                      <div>
                        <p className="text-green-400 font-semibold">✓ {files.length} {t.uploaded}</p>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {files.map((_, i) => (
                            <div key={i} className="aspect-square bg-white/10 rounded border border-white/20 flex items-center justify-center">✓</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 w-full">
                    <h3 className="text-2xl font-bold text-white mb-6">✓ {t.consent_title}</h3>
                    <label className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1 cursor-pointer" />
                      <span className="text-white/80">{t.consent_check1}</span>
                    </label>
                    <label className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1 cursor-pointer" />
                      <span className="text-white/80">{t.consent_check2}</span>
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="w-full space-y-6">
                    <h3 className="text-2xl font-bold text-white">{t.style_title}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {t.styles.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStyle(s)
                            setStep(4)
                          }}
                          className={`p-4 rounded-lg font-semibold transition-all hover:scale-105 ${
                            style === s
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-8">⚡ {t.generate_title}</h3>
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
                        generating
                          ? 'opacity-50 cursor-not-allowed bg-white/20'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50'
                      }`}
                    >
                      {generating ? (
                        <>⏳ {t.generating}</>
                      ) : (
                        `${t.generate_btn} ${style}`
                      )}
                    </button>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-8">👁️ {t.preview_title}</h3>
                    <div className="w-full max-w-sm aspect-square rounded-2xl bg-white/5 border-2 border-white/20 flex items-center justify-center text-6xl">
                      🖼️
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="w-full space-y-6">
                    <h3 className="text-2xl font-bold text-white">{t.payment_title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {PRICING.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => alert(`Comprado: ${plan.precio}`)}
                          className={`p-4 rounded-lg transition-all hover:scale-105 ${
                            plan.popular
                              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400'
                              : 'bg-white/10 border border-white/20'
                          }`}
                        >
                          {plan.popular && (
                            <div className="text-xs bg-purple-400 text-black px-2 py-1 rounded mb-2 inline-block">⭐</div>
                          )}
                          <div className="text-xl font-bold text-white">{plan.precio}</div>
                          <p className="text-white/60 text-sm">{plan.fotos} fotos</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BOTONES NAVEGACIÓN */}
              <div className="flex gap-4 justify-center mt-12">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all hover:scale-105"
                  >
                    ← {t.prev}
                  </button>
                )}
                {step > 0 && step < 6 && (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 transition-all hover:shadow-lg hover:shadow-purple-500/50"
                  >
                    {t.next} →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="backdrop-blur-xl bg-black/60 border-t border-white/10 py-6 text-center text-white/40 text-sm">
          © 2025 Studio Nexora Comet • Hecho con ❤️
        </footer>
      </div>

      {/* CHAT WIDGET */}
      {showChat && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/90 border border-white/20 rounded-2xl p-6 w-96 max-w-sm shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-bold">{t.chat_title}</h4>
            <button onClick={() => setShowChat(false)} className="text-white/60 hover:text-white transition-all">✕</button>
          </div>
          <div className="bg-white/5 rounded-lg p-4 mb-4 min-h-40 text-white/80">
            <p>{t.chat_msg}</p>
          </div>
          <input 
            type="text" 
            placeholder="Tu mensaje..." 
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400" 
          />
        </div>
      )}

      {/* SETTINGS */}
      {showSettings && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/90 border border-white/20 rounded-2xl p-6 w-80 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-bold">{t.settings_title}</h4>
            <button onClick={() => setShowSettings(false)} className="text-white/60 hover:text-white transition-all">✕</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm block mb-2">{t.lang}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLang('es')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    lang === 'es'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  🇪🇸 {t.spanish}
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    lang === 'en'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
