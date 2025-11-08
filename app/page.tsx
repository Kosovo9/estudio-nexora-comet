'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

const PRICING = [
  { id: 1, fotos: 1, precio: '$200', desc: 'Esencial' },
  { id: 2, fotos: 2, precio: '$350', desc: 'Profesional', popular: true },
  { id: 3, fotos: 3, precio: '$500', desc: 'Premium' },
  { id: 4, fotos: 10, precio: '$1,000', desc: 'Enterprise' },
]

export default function StudioNexoraCometLuxury() {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [currentStep, setCurrentStep] = useState(1)
  const [darkMode, setDarkMode] = useState(true)
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!mountRef.current || !darkMode) return

    // === THREE.JS EARTH 3D ===
    const scene = new THREE.Scene()
    sceneRef.current = scene

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
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Textura Tierra
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Gradiente océano a tierra
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#1a4d7a')
    gradient.addColorStop(0.3, '#2e7aa9')
    gradient.addColorStop(0.5, '#1a7f3a')
    gradient.addColorStop(0.7, '#3a5f2a')
    gradient.addColorStop(1, '#4a3f1a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Nube blancas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    for (let i = 0; i < 50; i++) {
      ctx.beginPath()
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 50 + 20,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    const geometry = new THREE.SphereGeometry(1, 128, 128)
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 10,
    })
    const earth = new THREE.Mesh(geometry, material)
    scene.add(earth)

    // Atmósfera glow
    const atmosphereGeo = new THREE.SphereGeometry(1.02, 128, 128)
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
    scene.add(atmosphere)

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const sunLight = new THREE.PointLight(0xffffff, 1.5)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    // Stars
    const starsGeo = new THREE.BufferGeometry()
    const starsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.015,
      sizeAttenuation: true,
    })

    const starsVertices = []
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      starsVertices.push(x, y, z)
    }

    starsGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(starsVertices), 3)
    )
    const stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      earth.rotation.y += 0.0003
      atmosphere.rotation.y -= 0.0001
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [darkMode])

  const texts = {
    es: { title: 'Studio Nexora Comet', sub: 'Estudio IA Profesional' },
    en: { title: 'Studio Nexora Comet', sub: 'Professional AI Studio' },
  }

  const t = texts[lang]

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      {/* EARTH BACKGROUND */}
      {darkMode && (
        <div
          ref={mountRef}
          className="fixed inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />
      )}

      {/* CONTENT OVERLAY */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* HEADER - LUXURY */}
        <header className="backdrop-blur-2xl bg-black/30 border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {t.title}
                </span>
              </h1>
              <p className="text-xs text-white/40 mt-1">{t.sub}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-all hover:text-white"
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-all hover:text-white"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 flex flex-col">
          {/* HERO SECTION */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-12 py-20">
            <div className="max-w-4xl text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                  <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
                    Transforma tus Fotos
                  </span>
                </h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                  {lang === 'es'
                    ? 'Tecnología de IA de última generación para editar fotos como profesional.'
                    : 'State-of-the-art AI technology to edit photos like a pro.'}
                </p>
              </div>

              {/* CTA BUTTON */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="group px-8 md:px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg transition-all hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
                >
                  {lang === 'es' ? 'Comenzar Ahora' : 'Start Now'}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              {/* PROGRESS INDICATOR */}
              <div className="flex justify-center gap-2 pt-12">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentStep === step
                        ? 'w-8 bg-white'
                        : currentStep > step
                        ? 'bg-white/50'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* PRICING SECTION */}
          <div className="px-6 md:px-12 py-20 space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-5xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  {lang === 'es' ? 'Planes Simples' : 'Simple Plans'}
                </span>
              </h3>
              <p className="text-white/60">
                {lang === 'es'
                  ? 'Sin sorpresas. Transparencia total.'
                  : 'No surprises. Complete transparency.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {PRICING.map((plan) => (
                <div
                  key={plan.id}
                  className={`group relative px-6 py-8 rounded-2xl backdrop-blur-xl transition-all hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-pink-400 text-black px-4 py-1 rounded-full text-xs font-bold">
                      ⭐ POPULAR
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <div className="text-4xl font-black">{plan.precio}</div>
                      <p className="text-white/60 text-sm mt-1">{plan.desc}</p>
                    </div>

                    <div>
                      <div className="text-2xl font-bold mb-2">{plan.fotos}</div>
                      <p className="text-white/50 text-sm">
                        {lang === 'es' ? 'Fotos editadas' : 'Edited photos'}
                      </p>
                    </div>

                    <button
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {lang === 'es' ? 'Elegir' : 'Choose'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURES SECTION */}
          <div className="px-6 md:px-12 py-20 space-y-12 bg-gradient-to-b from-transparent to-white/5">
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-black">
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Tecnología Premium
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { icon: '🤖', title: 'IA Avanzada', desc: 'Hugging Face + Google Studio' },
                { icon: '🎨', title: 'Edición Pro', desc: '50+ estilos personalizables' },
                { icon: '⚡', title: 'Ultra Rápido', desc: 'Procesamiento en <5 segundos' },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="text-5xl mb-4">{feat.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{feat.title}</h4>
                  <p className="text-white/60">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* FOOTER - LUXURY */}
        <footer className="backdrop-blur-xl bg-black/50 border-t border-white/5 mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
              <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-white transition">Help</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Social</h4>
                <div className="flex gap-4 text-white/60">
                  <a href="#" className="hover:text-white transition">𝕏</a>
                  <a href="#" className="hover:text-white transition">💼</a>
                  <a href="#" className="hover:text-white transition">📷</a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex justify-between items-center">
              <p className="text-white/40 text-sm">© 2025 Studio Nexora Comet</p>
              <p className="text-white/40 text-sm">Made with ❤️ for creators</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
