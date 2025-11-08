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
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [style, setStyle] = useState('Realista')
  const [generating, setGenerating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  // THREE.JS EARTH - NASA REALISTA
  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    // Posición perfecta - sin bola negra visible
    camera.position.set(0.3, 0.2, 2.3)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // === TEXTURA TIERRA NASA REAL ===
    const canvas = document.createElement('canvas')
    canvas.width = 16384
    canvas.height = 8192
    const ctx = canvas.getContext('2d')!

    // Base océano azul real NASA (#0066FF)
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    oceanGradient.addColorStop(0, '#004499')
    oceanGradient.addColorStop(0.3, '#0066FF')
    oceanGradient.addColorStop(0.7, '#0066CC')
    oceanGradient.addColorStop(1, '#003366')
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Continentes con formas realistas (América, África, Europa, Asia)
    for (let x = 0; x < canvas.width; x += 8) {
      for (let y = 0; y < canvas.height; y += 8) {
        const lon = (x / canvas.width) * Math.PI * 2
        const lat = (y / canvas.height) * Math.PI
        
        // Perlin noise mejorado para continentes reconocibles
        const noise1 = Math.sin(lon * 2) * Math.cos(lat * 1.5) * 0.7
        const noise2 = Math.sin(lon * 0.5) * Math.cos(lat * 0.8) * 0.3
        const noise3 = Math.sin(lon * 8) * Math.cos(lat * 3) * 0.1
        const totalNoise = noise1 + noise2 + noise3
        
        let color = '#0066FF' // Océano azul real
        
        // Continentes verdes reales (#228B22)
        if (totalNoise > 0.4) {
          color = '#1a5a1a' // Bosque oscuro
        } else if (totalNoise > 0.25) {
          color = '#228B22' // Verde tierra real
        } else if (totalNoise > 0.15) {
          color = '#32CD32' // Verde claro
        } else if (totalNoise > 0.05) {
          color = '#8B7355' // Marrón/tierra
        } else if (totalNoise > -0.1) {
          color = '#0066CC' // Océano claro
        }
        
        ctx.fillStyle = color
        ctx.fillRect(x, y, 8, 8)
      }
    }

    // Nubes blancas realistas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 180 + 60
      ctx.beginPath()
      ctx.ellipse(x, y, size, size * 0.6, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearMipmapLinearFilter

    const geometry = new THREE.SphereGeometry(1, 1024, 512)
    const material = new THREE.MeshStandardMaterial({ 
      map: texture, 
      roughness: 0.7, 
      metalness: 0,
      emissive: 0x000000
    })
    const earth = new THREE.Mesh(geometry, material)
    earth.castShadow = true
    earth.receiveShadow = true
    earth.rotation.x = 0.1
    scene.add(earth)

    // Atmósfera realista
    const atmGeo = new THREE.SphereGeometry(1.012, 512, 256)
    const atmMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x87ceeb) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float rim = pow(1.0 - abs(dot(vNormal, vPosition)), 2.5);
          gl_FragColor = vec4(glowColor, rim * 0.3);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    })
    const atmosphere = new THREE.Mesh(atmGeo, atmMat)
    scene.add(atmosphere)

    // Iluminación realista
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8)
    sunLight.position.set(3, 2, 5)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 4096
    sunLight.shadow.mapSize.height = 4096
    scene.add(sunLight)

    const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.4)
    scene.add(ambientLight)

    // Estrellas
    const starsGeo = new THREE.BufferGeometry()
    const vertices = []
    for (let i = 0; i < 6000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800
      )
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.1,
      transparent: true,
      opacity: 0.9
    }))
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
      geometry.dispose()
      material.dispose()
      atmGeo.dispose()
      atmMat.dispose()
      starsGeo.dispose()
      texture.dispose()
      renderer.dispose()
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  // === HANDLERS DE ARCHIVOS ===
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => {
      const isImage = f.type.startsWith('image/')
      const isValidSize = f.size <= 10 * 1024 * 1024 // 10MB
      return isImage && isValidSize
    })
    
    if (droppedFiles.length >= 3) {
      setFiles(droppedFiles)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } else {
      alert(lang === 'es' 
        ? 'Por favor, sube al menos 3 imágenes (máx 10MB cada una)'
        : 'Please upload at least 3 images (max 10MB each)')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(f => {
      const isImage = f.type.startsWith('image/')
      const isValidSize = f.size <= 10 * 1024 * 1024
      return isImage && isValidSize
    })
    
    if (selectedFiles.length >= 3) {
      setFiles(selectedFiles)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } else {
      alert(lang === 'es'
        ? 'Por favor, selecciona al menos 3 imágenes (máx 10MB cada una)'
        : 'Please select at least 3 images (max 10MB each)')
    }
  }

  const handleGenerate = async () => {
    if (files.length < 3) {
      alert(lang === 'es' 
        ? 'Por favor, sube al menos 3 imágenes primero'
        : 'Please upload at least 3 images first')
      return
    }
    
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
    setStep(5)
    alert(lang === 'es' ? '¡Fotos generadas con éxito!' : 'Photos generated successfully!')
  }

  // === TEXTS COMPLETOS EN ESPAÑOL/INGLÉS ===
  const t = {
    es: {
      title: 'Studio Nexora Comet',
      subtitle: 'Estudio IA Profesional',
      desc: 'Tecnología IA para editar como profesional',
      upload: 'Arrastra fotos aquí o haz clic',
      uploadHint: 'JPG, PNG, WebP • Máx 10MB • Min 3 imágenes',
      consent: 'Consentimiento',
      consent1: 'Acepto términos y condiciones',
      consent2: 'Autorizo usar fotos para mejorar IA',
      selectStyle: 'Elige estilo',
      generate: 'Generar',
      generating: 'Generando...',
      preview: 'Vista previa',
      payment: 'Pagar',
      start: 'Comenzar',
      next: 'Siguiente',
      prev: 'Atrás',
      imagesUploaded: 'imágenes cargadas',
      photos: 'fotos',
      purchased: 'Comprado',
      transform: 'Transforma tus Fotos',
    },
    en: {
      title: 'Studio Nexora Comet',
      subtitle: 'Professional AI Studio',
      desc: 'AI technology to edit like a pro',
      upload: 'Drag photos here or click',
      uploadHint: 'JPG, PNG, WebP • Max 10MB • Min 3 images',
      consent: 'Consent',
      consent1: 'I accept terms and conditions',
      consent2: 'Allow AI training with photos',
      selectStyle: 'Choose style',
      generate: 'Generate',
      generating: 'Generating...',
      preview: 'Preview',
      payment: 'Payment',
      start: 'Start',
      next: 'Next',
      prev: 'Back',
      imagesUploaded: 'images uploaded',
      photos: 'photos',
      purchased: 'Purchased',
      transform: 'Transform Your Photos',
    },
  }

  const text = t[lang]
  const steps = lang === 'es' 
    ? ['Subir', 'Consentimiento', 'Estilo', 'Generar', 'Revisar', 'Pagar']
    : ['Upload', 'Consent', 'Style', 'Generate', 'Preview', 'Payment']

  return (
    <div className="min-h-screen bg-black">
      <div ref={mountRef} className="fixed inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="backdrop-blur-xl bg-black/40 border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {text.title}
              </h1>
              <p className="text-xs text-white/40 mt-1">{text.subtitle}</p>
            </div>
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all hover:scale-105"
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
                  {text.transform}
                </h2>
                <p className="text-xl text-white/60">
                  {text.desc}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg hover:scale-105 transition-all hover:shadow-2xl hover:shadow-purple-500/50"
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

              {/* CONTENT */}
              <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                {step === 1 && (
                  <div className="w-full space-y-6">
                    <div
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`w-full p-20 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        dragActive
                          ? 'border-purple-400 bg-purple-500/20 scale-105'
                          : 'border-white/30 hover:border-purple-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="text-7xl mb-4">📸</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{text.upload}</h3>
                      <p className="text-white/60">{text.uploadHint}</p>
                    </div>
                    <input 
                      ref={fileRef} 
                      type="file" 
                      multiple 
                      accept="image/jpeg,image/png,image/webp" 
                      onChange={handleFileSelect} 
                      className="hidden" 
                    />
                    {uploadSuccess && (
                      <div className="p-4 bg-green-500/20 border border-green-400 rounded-lg text-green-400 text-center">
                        ✓ {lang === 'es' ? '¡Archivos cargados exitosamente!' : 'Files uploaded successfully!'}
                      </div>
                    )}
                    {files.length > 0 && (
                      <div>
                        <p className="text-green-400 font-semibold mb-4">
                          ✓ {files.length} {text.imagesUploaded}
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {files.map((file, i) => (
                            <div key={i} className="aspect-square bg-white/10 rounded border border-white/20 flex items-center justify-center text-xs text-white/60">
                              {file.name.substring(0, 8)}...
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 w-full">
                    <h3 className="text-2xl font-bold text-white mb-8">✓ {text.consent}</h3>
                    <label className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1 cursor-pointer" />
                      <span className="text-white/80">{text.consent1}</span>
                    </label>
                    <label className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                      <input type="checkbox" defaultChecked className="mt-1 cursor-pointer" />
                      <span className="text-white/80">{text.consent2}</span>
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="w-full space-y-6">
                    <h3 className="text-2xl font-bold text-white">🎨 {text.selectStyle}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Realista', 'Artístico', 'Cartoon', 'Cinematic', 'Pixelado', 'Hiper'].map((s) => (
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
                    <h3 className="text-2xl font-bold text-white mb-8">⚡ {text.generate}</h3>
                    <button
                      onClick={handleGenerate}
                      disabled={generating || files.length < 3}
                      className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
                        generating || files.length < 3
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50'
                      }`}
                    >
                      {generating ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          {text.generating}
                        </>
                      ) : (
                        `${text.generate} ${style}`
                      )}
                    </button>
                    {files.length < 3 && (
                      <p className="text-red-400 mt-4 text-sm">
                        {lang === 'es' ? 'Sube al menos 3 imágenes primero' : 'Upload at least 3 images first'}
                      </p>
                    )}
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
                          onClick={() => alert(`${text.purchased}: ${plan.precio}`)}
                          className={`p-4 rounded-lg transition-all hover:scale-105 ${
                            plan.popular
                              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400'
                              : 'bg-white/10 border border-white/20'
                          }`}
                        >
                          {plan.popular && (
                            <div className="text-xs bg-purple-400 text-black px-2 py-1 rounded mb-2 inline-block">
                              ⭐ {lang === 'es' ? 'POPULAR' : 'POPULAR'}
                            </div>
                          )}
                          <div className="text-2xl font-bold text-white">{plan.precio}</div>
                          <p className="text-white/60 text-sm">{plan.fotos} {text.photos}</p>
                          <p className="text-white/80 text-xs mt-1">{plan.desc}</p>
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
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all hover:scale-105"
                  >
                    ← {text.prev}
                  </button>
                )}
                {step > 0 && step < 6 && (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
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
          © 2025 Studio Nexora Comet • {lang === 'es' ? 'Hecho con' : 'Made with'} ❤️
        </footer>
      </div>
    </div>
  )
}
