'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Heart, Star, ChevronRight, ChevronLeft, Menu, X, LogOut, Settings, TrendingUp, Users, DollarSign, Eye, EyeOff } from 'lucide-react'

// === MOCK DATA ===
const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1611339555312-e607c04352fd?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1516414447565-b2e1c3cead5e?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=500&fit=crop',
]

const STYLES = ['Realista', 'Artístico', 'Cartoon', 'Cinematic', 'Pixelado', 'Hiperrealista']

const PRICING_PLANS = [
  { id: 1, fotos: 1, precio: 200, caracteristicas: ['1 foto AI', 'Edición básica', '24h descarga'] },
  { id: 2, fotos: 2, precio: 350, caracteristicas: ['2 fotos AI', 'Edición avanzada', '7 días descarga'], popular: true },
  { id: 3, fotos: 3, precio: 500, caracteristicas: ['3 fotos AI', 'Edición profesional', 'Sin límite'] },
  { id: 4, fotos: 10, precio: 1000, caracteristicas: ['10 fotos AI', 'Edición pro+', 'Licencia comercial'] },
]

const FEATURES = [
  { icon: '🤖', title: 'IA Avanzada', desc: 'Hugging Face + Google Studio' },
  { icon: '🎨', title: 'Edición Pro', desc: 'Pixaverse Style 50+ opciones' },
  { icon: '📈', title: 'Dashboard', desc: 'Métricas en tiempo real' },
  { icon: '💰', title: 'Afiliados', desc: '20% comisión permanente' },
  { icon: '🌍', title: 'Multiidioma', desc: '12 idiomas disponibles' },
  { icon: '📱', title: 'Mobile First', desc: '100% responsive' },
]

// === COMPONENTE PRINCIPAL ===
export default function StudioNexoraCometPremium() {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [currentStep, setCurrentStep] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [showPricingComparison, setShowPricingComparison] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState('Realista')
  const [affiliateCode, setAffiliateCode] = useState('NXR_' + Math.random().toString(36).substr(2, 9).toUpperCase())
  const [affiliateStats, setAffiliateStats] = useState({ clicks: 0, conversions: 0, earnings: 0 })
  const [adminMetrics, setAdminMetrics] = useState({ totalUsers: 1250, revenue: 45000, activeNow: 342 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const texts = {
    es: {
      title: 'Studio Nexora Comet',
      subtitle: 'Estudio IA Profesional',
      tagline: 'Transforma fotos con IA | Edición Pro | Marketplace | Afiliados 20%',
      uploadPhotos: 'Subir Fotos',
      nextStep: 'Siguiente',
      prevStep: 'Atrás',
      selectStyle: 'Elige Estilo',
      generateAI: 'Generar con IA',
      preview: 'Revisar',
      payment: 'Pagar Ahora',
      logout: 'Salir',
      affiliatePanel: 'Panel de Afiliados',
      adminDashboard: 'Dashboard Admin',
      switchLang: 'English',
    },
    en: {
      title: 'Studio Nexora Comet',
      subtitle: 'Professional AI Studio',
      tagline: 'Transform Photos with AI | Pro Editing | Marketplace | 20% Affiliates',
      uploadPhotos: 'Upload Photos',
      nextStep: 'Next',
      prevStep: 'Back',
      selectStyle: 'Choose Style',
      generateAI: 'Generate with AI',
      preview: 'Preview',
      payment: 'Pay Now',
      logout: 'Logout',
      affiliatePanel: 'Affiliate Panel',
      adminDashboard: 'Admin Dashboard',
      switchLang: 'Español',
    },
  }

  const t = texts[lang]

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % GALLERY_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // === COMPONENTES REUTILIZABLES ===
  const Button = ({ children, onClick, variant = 'primary', disabled = false }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 24px',
        background: variant === 'primary' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(99, 102, 241, 0.1)',
        border: variant === 'primary' ? 'none' : '1px solid rgba(99, 102, 241, 0.3)',
        color: '#fff',
        borderRadius: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s',
      }}
      onMouseOver={(e) => {
        if (!disabled && variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.4)'
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {children}
    </button>
  )

  const StepCard = ({ num, active }: { num: number; active: boolean }) => (
    <div
      onClick={() => setCurrentStep(num)}
      style={{
        padding: '16px 20px',
        background: active ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(100, 116, 139, 0.1)',
        border: `2px solid ${active ? '#60a5fa' : 'rgba(148, 163, 184, 0.2)'}`,
        borderRadius: 12,
        cursor: 'pointer',
        color: active ? '#fff' : '#cbd5e1',
        fontWeight: 600,
        transition: 'all 0.3s',
        textAlign: 'center',
        minWidth: 100,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div>{num}</div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* === HEADER === */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          background: 'linear-gradient(90deg, #60a5fa, #d8b4fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
        }}>
          {t.title}
        </h1>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            style={{
              padding: '8px 16px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#93c5fd',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            🌐 {t.switchLang}
          </button>
          
          {isAuthenticated && (
            <>
              <button
                onClick={() => {
                  const affiliateSection = document.getElementById('affiliate')
                  affiliateSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#86efac',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                💰 {t.affiliatePanel}
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                🚪 {t.logout}
              </button>
            </>
          )}
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 40px' }}>
        {/* === HERO SECTION === */}
        {!isAuthenticated ? (
          <section style={{ textAlign: 'center', marginBottom: 100 }}>
            <h2 style={{
              fontSize: 56,
              fontWeight: 800,
              background: 'linear-gradient(90deg, #60a5fa, #ec4899, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 20px 0',
            }}>
              {t.title}
            </h2>
            <p style={{ fontSize: 24, color: '#cbd5e1', margin: '0 0 10px 0' }}>
              {t.subtitle}
            </p>
            <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 40px 0', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
              {t.tagline}
            </p>

            {/* FEATURES GRID */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 24,
              marginBottom: 60,
            }}>
              {FEATURES.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 24,
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 16,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{feat.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>{feat.title}</h3>
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* GALLERY CAROUSEL */}
            <div style={{
              position: 'relative',
              maxWidth: 600,
              margin: '0 auto 60px',
              borderRadius: 20,
              overflow: 'hidden',
            }}>
              <img
                src={GALLERY_IMAGES[carouselIdx]}
                alt="Gallery"
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                onClick={() => setShowLightbox(true)}
              />
              <button
                onClick={() => setCarouselIdx((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 24,
                  cursor: 'pointer',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setCarouselIdx((prev) => (prev + 1) % GALLERY_IMAGES.length)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 24,
                  cursor: 'pointer',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* PRICING SECTION */}
            <div style={{ marginBottom: 60 }}>
              <h3 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 40px 0' }}>
                {lang === 'es' ? 'Planes y Precios' : 'Plans & Pricing'}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 24,
              }}>
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    style={{
                      padding: 32,
                      background: plan.popular ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' : 'rgba(30, 41, 59, 0.8)',
                      border: `2px solid ${plan.popular ? 'rgba(99, 102, 241, 0.5)' : 'rgba(148, 163, 184, 0.2)'}`,
                      borderRadius: 16,
                      transition: 'all 0.3s',
                      position: 'relative',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {plan.popular && (
                      <div style={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#fff',
                      }}>
                        ⭐ POPULAR
                      </div>
                    )}
                    <div style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px 0' }}>
                      ${plan.precio} MXN
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px 0' }}>
                      {plan.fotos} {plan.fotos === 1 ? (lang === 'es' ? 'Foto' : 'Photo') : (lang === 'es' ? 'Fotos' : 'Photos')}
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      {plan.caracteristicas.map((car, idx) => (
                        <div key={idx} style={{ fontSize: 14, color: '#cbd5e1', margin: '8px 0', textAlign: 'left' }}>
                          ✓ {car}
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => setIsAuthenticated(true)}>
                      {lang === 'es' ? 'Elegir Plan' : 'Choose Plan'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA LOGIN */}
            <div style={{ textAlign: 'center' }}>
              <Button onClick={() => setIsAuthenticated(true)}>
                🚀 {lang === 'es' ? 'Empezar Ahora' : 'Get Started Now'}
              </Button>
            </div>
          </section>
        ) : (
          /* === AUTHENTICATED AREA === */
          <section>
            {/* PROGRESS STEPS */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 40,
              flexWrap: 'wrap',
            }}>
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <StepCard key={step} num={step} active={currentStep === step} />
              ))}
            </div>

            {/* STEP CONTENT */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: 24,
              padding: 60,
              marginBottom: 40,
            }}>
              {/* STEP 1: UPLOAD */}
              {currentStep === 1 && (
                <div>
                  <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                    📸 {t.uploadPhotos}
                  </h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = e.currentTarget.files
                      if (files) {
                        setUploadedImages(Array.from(files).map(f => URL.createObjectURL(f)))
                      }
                    }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(96, 165, 250, 0.3)',
                      borderRadius: 16,
                      padding: 80,
                      background: 'rgba(15, 23, 42, 0.5)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)'
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)'
                    }}
                  >
                    <div style={{ fontSize: 64, marginBottom: 20 }}>⬆️</div>
                    <p style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px 0' }}>
                      {lang === 'es' ? 'Arrastra o haz clic' : 'Drag or click'}
                    </p>
                    <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>
                      JPG, PNG, WebP • Máx 10MB • Min 3 {lang === 'es' ? 'imágenes' : 'images'}
                    </p>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                      gap: 12,
                      marginTop: 24,
                    }}>
                      {uploadedImages.map((img, idx) => (
                        <img key={idx} src={img} alt="uploaded" style={{
                          width: '100%',
                          aspectRatio: '1',
                          objectFit: 'cover',
                          borderRadius: 8,
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: CONSENT */}
              {currentStep === 2 && (
                <div>
                  <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                    ✓ {lang === 'es' ? 'Consentimiento' : 'Consent'}
                  </h3>
                  <div style={{ textAlign: 'left', maxWidth: 600, margin: '0 auto' }}>
                    <label style={{
                      display: 'flex',
                      gap: 12,
                      padding: 16,
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: 12,
                      cursor: 'pointer',
                      marginBottom: 12,
                    }}>
                      <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                      <span>{lang === 'es' ? 'Acepto términos y condiciones' : 'I accept terms'}</span>
                    </label>
                    <label style={{
                      display: 'flex',
                      gap: 12,
                      padding: 16,
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: 12,
                      cursor: 'pointer',
                    }}>
                      <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                      <span>{lang === 'es' ? 'Autorizo usar fotos para IA' : 'Allow AI training with photos'}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: STYLE */}
              {currentStep === 3 && (
                <div>
                  <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                    🎨 {t.selectStyle}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 16,
                  }}>
                    {STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        style={{
                          padding: 20,
                          background: selectedStyle === style ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(99, 102, 241, 0.1)',
                          border: `2px solid ${selectedStyle === style ? '#60a5fa' : 'rgba(99, 102, 241, 0.3)'}`,
                          borderRadius: 12,
                          color: selectedStyle === style ? '#fff' : '#93c5fd',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: GENERATE */}
              {currentStep === 4 && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                    ⚡ {t.generateAI}
                  </h3>
                  <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 30 }}>
                    Procesando con IA ({selectedStyle})...
                  </p>
                  <div style={{
                    width: 60,
                    height: 60,
                    border: '4px solid rgba(96, 165, 250, 0.2)',
                    borderTopColor: '#60a5fa',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite',
                  }} />
                </div>
              )}

              {/* STEP 5: PREVIEW */}
              {currentStep === 5 && (
                <div>
                  <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                    👁️ {t.preview}
                  </h3>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 16,
                    aspectRatio: '1',
                    maxWidth: 400,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 64,
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowLightbox(true)}>
                    🖼️
                  </div>
                </div>
              )}

              {/* STEP 6: PAYMENT */}
              {currentStep === 6 && (
                <div>
                  <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                    💳 {t.payment}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 16,
                  }}>
                    {PRICING_PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        style={{
                          padding: 24,
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                          border: '2px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: 12,
                          color: '#86efac',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
                        {plan.fotos} {lang === 'es' ? 'Fotos' : 'Photos'}
                        <div style={{ fontSize: 20, marginTop: 8 }}>
                          ${plan.precio} MXN
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              marginBottom: 40,
            }}>
              <Button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                variant="secondary"
              >
                ← {t.prevStep}
              </Button>
              <Button
                onClick={() => {
                  if (currentStep < 6) setCurrentStep(currentStep + 1)
                  else alert(lang === 'es' ? '¡Pago completado!' : 'Payment completed!')
                }}
                disabled={currentStep === 6}
              >
                {currentStep === 6 ? (lang === 'es' ? '✓ Completado' : '✓ Completed') : t.nextStep} →
              </Button>
            </div>

            {/* AFFILIATE SECTION */}
            <section id="affiliate" style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: 24,
              padding: 40,
              marginBottom: 40,
            }}>
              <h3 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 24px 0', color: '#86efac' }}>
                💰 {t.affiliatePanel}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 24,
                marginBottom: 24,
              }}>
                <div style={{
                  padding: 24,
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: 12,
                  borderLeft: '4px solid #22c55e',
                }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                    {lang === 'es' ? 'Tu Código' : 'Your Code'}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#86efac', fontFamily: 'monospace' }}>
                    {affiliateCode}
                  </div>
                </div>
                <div style={{
                  padding: 24,
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 12,
                  borderLeft: '4px solid #3b82f6',
                }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                    {lang === 'es' ? 'Clics' : 'Clicks'}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#93c5fd' }}>
                    {affiliateStats.clicks}
                  </div>
                </div>
                <div style={{
                  padding: 24,
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: 12,
                  borderLeft: '4px solid #a855f7',
                }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                    {lang === 'es' ? 'Ganancias' : 'Earnings'}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#d8b4fe' }}>
                    ${affiliateStats.earnings.toLocaleString()}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>
                {lang === 'es'
                  ? '20% comisión permanente por cada referral. Gana mientras duermes.'
                  : '20% permanent commission per referral. Earn while you sleep.'}
              </p>
            </section>

            {/* ADMIN METRICS */}
            <section style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: 24,
              padding: 40,
            }}>
              <h3 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 24px 0' }}>
                📊 Dashboard Métricas
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 24,
              }}>
                <div style={{
                  padding: 24,
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>
                    {lang === 'es' ? 'Usuarios Totales' : 'Total Users'}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#93c5fd' }}>
                    {adminMetrics.totalUsers.toLocaleString()}
                  </div>
                </div>
                <div style={{
                  padding: 24,
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>
                    {lang === 'es' ? 'Ingresos Hoy' : 'Revenue Today'}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#86efac' }}>
                    ${adminMetrics.revenue.toLocaleString()}
                  </div>
                </div>
                <div style={{
                  padding: 24,
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>
                    {lang === 'es' ? 'Activos Ahora' : 'Active Now'}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#fca5a5' }}>
                    {adminMetrics.activeNow.toLocaleString()}
                  </div>
                </div>
              </div>
            </section>
          </section>
        )}
      </main>

      {/* === FOOTER === */}
      <footer style={{
        background: 'rgba(15, 23, 42, 0.8)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '40px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 14,
      }}>
        <div style={{ marginBottom: 16 }}>
          {lang === 'es'
            ? '© Studio Nexora Comet 2025 | Aviso Legal | Privacidad | Cookies'
            : '© Studio Nexora Comet 2025 | Legal | Privacy | Cookies'}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontSize: 20 }}>
          📘 📗 🐦 💼
        </div>
      </footer>

      {/* === LIGHTBOX === */}
      {showLightbox && (
        <div
          onClick={() => setShowLightbox(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            cursor: 'pointer',
          }}
        >
          <img
            src={GALLERY_IMAGES[carouselIdx]}
            alt="Full"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#fff',
              fontSize: 24,
              cursor: 'pointer',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* === ANIMATIONS === */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

