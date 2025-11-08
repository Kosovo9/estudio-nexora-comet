'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const PRICING = [
  { id: 1, fotos: 1, precio: '$200', desc: 'Esencial' },
  { id: 2, fotos: 2, precio: '$350', desc: 'Profesional', popular: true },
  { id: 3, fotos: 3, precio: '$500', desc: 'Premium' },
  { id: 4, fotos: 10, precio: '$1,000', desc: 'Enterprise' },
]

export default function StudioNexora() {
  const [lang, setLang] = useState('es')
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [style, setStyle] = useState('Realista')
  const [generating, setGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  // THREE.JS EARTH
  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    camera.position.set(0.2, 0.15, 2.2)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // Create Earth texture with real colors
    const canvas = document.createElement('canvas')
    canvas.width = 8192
    canvas.height = 4096
    const ctx = canvas.getContext('2d')!

    // Ocean base
    ctx.fillStyle = '#0d47a1'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Land masses
    for (let x = 0; x < canvas.width; x += 16) {
      for (let y = 0; y < canvas.height; y += 16) {
        const lon = (x / canvas.width) * Math.PI * 2
        const lat = (y / canvas.height) * Math.PI
        const noise = Math.sin(lon * 1.5) * Math.cos(lat) + Math.sin(lon * 0.5) * Math.cos(lat * 0.8)
        
        let color = '#0d47a1'
        if (noise > 0.3) color = '#2d5016'
        else if (noise > 0.15) color = '#3d6b1f'
        else if (noise > 0) color = '#558b2f'
        else if (noise > -0.2) color = '#1976d2'
        
        ctx.fillStyle = color
        ctx.fillRect(x, y, 16, 16)
      }
    }

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 150 + 50
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    const geometry = new THREE.SphereGeometry(1, 512, 256)
    const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6, metalness: 0 })
    const earth = new THREE.Mesh(geometry, material)
    scene.add(earth)

    // Atmosphere
    const atmGeo = new THREE.SphereGeometry(1.01, 256, 128)
    const atmMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.2, side: THREE.BackSide })
    scene.add(new THREE.Mesh(atmGeo, atmMat))

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1.5)
    light1.position.set(2, 2, 3)
    scene.add(light1)
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    // Stars
    const starsGeo = new THREE.BufferGeometry()
    const vertices = []
    for (let i = 0; i < 5000; i++) {
      vertices.push((Math.random() - 0.5) * 500, (Math.random() - 0.5) * 500, (Math.random() - 0.5) * 500)
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }))
    scene.add(stars)

    let id: number
    const animate = () => {
      id = requestAnimationFrame(animate)
      earth.rotation.y += 0.0001
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
      cancelAnimationFrame(id)
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

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
    alert(lang === 'es' ? '¡Fotos generadas con éxito!' : 'Photos generated successfully!')
  }

  const t = {
    es: {
      title: 'Studio Nexora Comet',
      upload: 'Arrastra fotos aquí',
      uploadHint: 'JPG, PNG, WebP • Máx 10MB • Min 3 imágenes',
      consent: 'Acepto términos',
      selectStyle: 'Elige estilo',
      generate: 'Generar',
      preview: 'Vista previa',
      payment: 'Pagar',
      start: 'Comenzar',
      next: 'Siguiente',
      prev: 'Atrás',
    },
    en: {
      title: 'Studio Nexora Comet',
      upload: 'Drag photos here',
      uploadHint: 'JPG, PNG, WebP • Max 10MB • Min 3 images',
      consent: 'I accept terms',
      selectStyle: 'Choose style',
      generate: 'Generate',
      preview: 'Preview',
      payment: 'Payment',
      start: 'Start',
      next: 'Next',
      prev: 'Back',
    },
  }

  const text = t[lang as keyof typeof t]
  const steps = lang === 'es' ? ['Subir', 'Consentimiento', 'Estilo', 'Generar', 'Revisar', 'Pagar'] : ['Upload', 'Consent', 'Style', 'Generate', 'Preview', 'Payment']

  return (
    <div className="min-h-screen bg-black">
      <div ref={mountRef} className="fixed inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="backdrop-blur-xl bg-black/40 border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {text.title}
            </h1>
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 flex flex-col">
          {step === 0 ? (
            /* LANDING */
            <div className="flex-1 flex items-center justify-center px-6 py-20">
              <div className="max-w-4xl text-center space-y-8">
                <h2 className="text-6xl md:text-7xl font-black text-white">
                  {lang === 'es' ? 'Transforma tus Fotos' : 'Transform Your Photos'}
                </h2>
                <p className="text-xl text-white/60">
                  {lang === 'es'
                    ? 'Tecnología IA para editar como profesional'
                    : 'AI technology to edit like a pro'}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg hover:scale-105 transition-all"
                >
                  {text.start} →
                </button>
              </div>
            </div>
          ) : (
            /* WORKFLOW */
            <div className="flex-1 flex flex-col px-6 py-12">
              {/* PROGRESS STEPS */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i + 1)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      step === i + 1
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {step > i + 1 ? '✓' : i + 1}. {s}
                  </button>
                ))}
              </div>

              {/* CONTENT */}
              <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                {step === 1 && (
                  <div className="w-full space-y-6">
                    <div
                      onDragEnter={() => setDragActive(true)}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`w-full p-20 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        dragActive
                          ? 'border-purple-400 bg-purple-500/20'
                          : 'border-white/30 hover:border-purple-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="text-7xl mb-4">📸</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{text.upload}</h3>
                      <p className="text-white/60">{text.uploadHint}</p>
                    </div>
                    <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                    {files.length > 0 && (
                      <div>
                        <p className="text-green-400 font-semibold mb-4">✓ {files.length} {lang === 'es' ? 'imágenes cargadas' : 'images uploaded'}</p>
                        <div className="grid grid-cols-6 gap-2">
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
                    <h3 className="text-2xl font-bold text-white">✓ {text.consent}</h3>
                    <label className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked />
                      <span className="text-white/80">{lang === 'es' ? 'Acepto términos y condiciones' : 'I accept terms and conditions'}</span>
                    </label>
                    <label className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked />
                      <span className="text-white/80">{lang === 'es' ? 'Autorizo usar fotos para IA' : 'Allow AI training with photos'}</span>
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="w-full space-y-6">
                    <h3 className="text-2xl font-bold text-white">🎨 {text.selectStyle}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['Realista', 'Artístico', 'Cartoon', 'Cinematic', 'Pixelado', 'Hiper'].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStyle(s)
                            setStep(4)
                          }}
                          className={`p-4 rounded-lg font-semibold transition-all ${
                            style === s
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
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
                    <h3 className="text-2xl font-bold text-white mb-8">⚡ {text.generate}</h3>
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
                        generating
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105'
                      }`}
                    >
                      {generating ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          {lang === 'es' ? 'Generando...' : 'Generating...'}
                        </>
                      ) : (
                        `${text.generate} ${style}`
                      )}
                    </button>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-8">👁️ {text.preview}</h3>
                    <div className="w-full max-w-sm aspect-square rounded-2xl bg-white/5 border-2 border-white/20 flex items-center justify-center text-6xl">
                      🖼️
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="w-full space-y-6">
                    <h3 className="text-2xl font-bold text-white">💳 {text.payment}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {PRICING.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => alert(`${lang === 'es' ? 'Comprado: ' : 'Purchased: '}${plan.precio}`)}
                          className={`p-4 rounded-lg transition-all hover:scale-105 ${
                            plan.popular
                              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400'
                              : 'bg-white/10 border border-white/20'
                          }`}
                        >
                          {plan.popular && <div className="text-xs bg-purple-400 text-black px-2 py-1 rounded mb-2 inline-block">⭐</div>}
                          <div className="text-2xl font-bold text-white">{plan.precio}</div>
                          <p className="text-white/60 text-sm">{plan.fotos} {lang === 'es' ? 'fotos' : 'photos'}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* NAVIGATION */}
              <div className="flex gap-4 justify-center mt-12">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                  >
                    ← {text.prev}
                  </button>
                )}
                {step > 0 && step < 6 && (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 transition-all"
                  >
                    {text.next} →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="backdrop-blur-xl bg-black/60 border-t border-white/10 py-6 text-center text-white/40 text-sm">
          © 2025 Studio Nexora Comet • Made with ❤️
        </footer>
      </div>
    </div>
  )
}
