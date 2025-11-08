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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedStyle, setSelectedStyle] = useState('Realista')
  const [isGenerating, setIsGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // === THREE.JS EARTH 3D - LIMPIEZAS DE ARTEFACTOS ===
  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 100, 1000)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    camera.position.z = 2.2

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
      precision: 'highp',
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // ⚠️ Limpia antes de insertar
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // === EARTH TEXTURE REALISTA ===
    const canvas = document.createElement('canvas')
    canvas.width = 8192
    canvas.height = 4096
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!

    // Base agua
    ctx.fillStyle = '#0d47a1'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Generador Perlin ruido (simplificado)
    for (let x = 0; x < canvas.width; x += 4) {
      for (let y = 0; y < canvas.height; y += 4) {
        const n = Math.sin(x * 0.0005) * Math.cos(y * 0.0007)
        let color = '#0d47a1'
        
        if (n > 0.7) color = '#1565c0'
        else if (n > 0.5) color = '#1976d2'
        else if (n > 0.3) color = '#1e88e5'
        else if (n > 0.15) color = '#2e7d32'
        else if (n > 0) color = '#388e3c'
        else if (n > -0.15) color = '#43a047'
        else if (n > -0.3) color = '#558b2f'
        else if (n > -0.5) color = '#8d6e63'
        else color = '#5d4037'

        ctx.fillStyle = color
        ctx.fillRect(x, y, 4, 4)
      }
    }

    // Nubes realistas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const r = Math.random() * 120 + 40
      ctx.beginPath()
      ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter

    const geometry = new THREE.SphereGeometry(1, 512, 512)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.1,
    })
    const earth = new THREE.Mesh(geometry, material)
    earth.castShadow = true
    earth.receiveShadow = true
    scene.add(earth)

    // === ATMÓSFERA LIMPIA (sin color sólido) ===
    const atmosphereGeo = new THREE.SphereGeometry(1.015, 256, 256)
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x0088ff) },
        glowAlpha: { value: 0.08 }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowAlpha;
        varying vec3 vNormal;
        void main() {
          float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
          gl_FragColor = vec4(glowColor, rim * glowAlpha);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    })
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
    scene.add(atmosphere)

    // === ILUMINACIÓN REALISTA ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 3, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 4096
    directionalLight.shadow.mapSize.height = 4096
    directionalLight.shadow.camera.far = 10
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xff6b9d, 0.8)
    pointLight.position.set(-5, 0, 3)
    scene.add(pointLight)

    // === STARS INFINITOS (sin clipping) ===
    const starsGeo = new THREE.BufferGeometry()
    const starsVertices = []
    const starsSizes = []
    
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 500
      const y = (Math.random() - 0.5) * 500
      const z = (Math.random() - 0.5) * 500
      starsVertices.push(x, y, z)
      starsSizes.push(Math.random() * 0.5 + 0.1)
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starsVertices), 3))
    starsGeo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(starsSizes), 1))

    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    })

    const stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)

    // === ANIMATION LOOP ===
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      earth.rotation.y += 0.00015
      atmosphere.rotation.y -= 0.00008
      
      // Rotación suave de estrellas
      stars.rotation.y += 0.00002
      
      renderer.render(scene, camera)
    }
    animate()

    // === RESIZE HANDLER ===
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // === CLEANUP PERFECTO ===
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      
      geometry.dispose()
      material.dispose()
      atmosphereGeo.dispose()
      atmosphereMat.dispose()
      starsGeo.dispose()
      starsMat.dispose()
      texture.dispose()
      
      renderer.dispose()
      
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  const t = {
    es: {
      title: 'Studio Nexora Comet',
      sub: 'Estudio IA Profesional',
      desc: 'Tecnología de IA para editar fotos como profesional',
      start: 'Comenzar Ahora',
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
    },
    en: {
      title: 'Studio Nexora Comet',
      sub: 'Professional AI Studio',
      desc: 'AI technology to edit photos like a pro',
      start: 'Start Now',
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

      {/* OVERLAY GRADIENT */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" style={{ zIndex: 1 }} />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="backdrop-blur-2xl bg-black/30 border-b border-white/5 sticky top-0 z-50">
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

                <div className="flex justify-center gap-2 pt-8">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentStep === i ? 'w-8 bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // === WORKFLOW ===
            <div className="flex-1 flex flex-col px-6 md:px-12 py-12">
              {/* PROGRESS STEPS */}
              <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
                {steps.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i + 1)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
                      currentStep === i + 1
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : currentStep > i + 1
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {currentStep > i + 1 ? '✓' : i + 1}. {step}
                  </button>
                ))}
              </div>

              {/* STEP CONTENT */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {currentStep === 1 && (
                  <div className="max-w-2xl w-full space-y-6">
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-16 md:p-24 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        dragActive
                          ? 'border-purple-400 bg-purple-500/10'
                          : 'border-white/20 hover:border-purple-500 hover:bg-white/5'
                      }`}
                    >
                      <div className="text-7xl md:text-8xl mb-4">📸</div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{texts.upload}</h3>
                      <p className="text-white/60">{texts.uploadHint}</p>
                    </div>

                    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

                    {uploadedFiles.length > 0 && (
                      <div>
                        <p className="text-green-400 font-semibold mb-4">✓ {uploadedFiles.length} {lang === 'es' ? 'imágenes' : 'images'}</p>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {uploadedFiles.map((_, i) => (
                            <div key={i} className="aspect-square rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">✓</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="max-w-md w-full space-y-4">
                    <h3 className="text-2xl font-bold mb-8">✓ {lang === 'es' ? 'Consentimiento' : 'Consent'}</h3>
                    <label className="flex gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1" />
                      <span className="text-white/80">{texts.consent}</span>
                    </label>
                    <label className="flex gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1" />
                      <span className="text-white/80">{texts.consentAI}</span>
                    </label>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="max-w-3xl w-full space-y-6">
                    <h3 className="text-2xl font-bold">🎨 {texts.selectStyle}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

                {currentStep === 4 && (
                  <div className="text-center">
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

                {currentStep === 5 && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-8">👁️ {texts.preview}</h3>
                    <div className="w-full max-w-md aspect-square rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center text-6xl">
                      🖼️
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="max-w-5xl w-full space-y-6">
                    <h3 className="text-2xl font-bold">💳 {texts.payment}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          {plan.popular && <div className="text-xs bg-purple-400 text-black px-2 py-1 rounded mb-3 inline-block">⭐</div>}
                          <div className="text-3xl font-bold">{plan.precio}</div>
                          <p className="text-white/60 text-sm mt-2">{plan.fotos} {lang === 'es' ? 'Fotos' : 'Photos'}</p>
                          <p className="text-white/80 text-xs mt-1">{plan.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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

                {currentStep > 0 && currentStep < 6 && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    {texts.next} →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="backdrop-blur-xl bg-black/60 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-center">
            <p className="text-white/40 text-sm">© 2025 Studio Nexora Comet • Hecho con ❤️</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
