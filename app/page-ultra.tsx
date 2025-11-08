'use client'

import React, { useState } from 'react'
import { Mail } from 'lucide-react'

export default function Home() {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [currentStep, setCurrentStep] = useState(1)
  const [showCopilot, setShowCopilot] = useState(false)
  const [showQA, setShowQA] = useState(false)

  const texts = {
    es: {
      title: 'Studio Nexora Comet',
      subtitle: 'Estudio de Fotos con IA',
      description: 'Transforma tus fotos con IA. Edición profesional, marketplace y red de afiliados.',
      steps: ['Subir', 'Consentimiento', 'Estilo', 'Generar', 'Revisar', 'Pagar'],
      uploadBtn: '📸 Subir Fotos',
      uploadHint: 'JPG, PNG, WebP • Máx 10MB • Min 3 imágenes',
      nextBtn: 'Siguiente →',
      backBtn: '← Atrás',
      copilot: 'Copiloto IA',
      qa: '✓ QA Automático',
      switchLang: 'English',
    },
    en: {
      title: 'Studio Nexora Comet',
      subtitle: 'AI-Powered Photo Studio',
      description: 'Transform your photos with AI. Professional editing, marketplace & affiliate network.',
      steps: ['Upload', 'Consent', 'Style', 'Generate', 'Preview', 'Payment'],
      uploadBtn: '📸 Upload Photos',
      uploadHint: 'JPG, PNG, WebP • Max 10MB • Min 3 images',
      nextBtn: 'Next →',
      backBtn: '← Back',
      copilot: 'AI Copilot',
      qa: '✓ Automated QA',
      switchLang: 'Español',
    },
  }

  const t = texts[lang]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
    }}>
      {/* HEADER */}
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
          fontSize: 24,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #93c5fd, #d8b4fe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
        }}>{t.title}</h1>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            🌐 {t.switchLang}
          </button>
          <button
            onClick={() => setShowQA(!showQA)}
            style={{
              padding: '8px 16px',
              background: showQA ? 'rgba(52, 211, 153, 0.2)' : 'rgba(168, 85, 247, 0.1)',
              border: `1px solid ${showQA ? 'rgba(52, 211, 153, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
              color: showQA ? '#86efac' : '#d8b4fe',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {t.qa}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 40px',
        textAlign: 'center',
      }}>
        {/* HERO */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{
            fontSize: 56,
            fontWeight: 800,
            background: 'linear-gradient(90deg, #60a5fa, #ec4899, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 16px 0',
            letterSpacing: '-2px',
          }}>
            {t.title}
          </h2>
          <p style={{
            fontSize: 20,
            color: '#cbd5e1',
            margin: '0 0 8px 0',
          }}>
            {t.subtitle}
          </p>
          <p style={{
            fontSize: 16,
            color: '#94a3b8',
            maxWidth: 600,
            margin: '0 auto',
          }}>
            {t.description}
          </p>
        </div>

        {/* PROGRESS STEPS */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 60,
          flexWrap: 'wrap',
        }}>
          {t.steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStep(idx + 1)}
              style={{
                padding: '12px 20px',
                background: currentStep === idx + 1
                  ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  : currentStep > idx + 1
                  ? 'rgba(34, 197, 94, 0.2)'
                  : 'rgba(100, 116, 139, 0.1)',
                border: `2px solid ${currentStep === idx + 1 ? '#60a5fa' : 'rgba(148, 163, 184, 0.2)'}`,
                borderRadius: 12,
                cursor: 'pointer',
                color: currentStep === idx + 1 ? '#fff' : '#cbd5e1',
                fontWeight: 600,
                transition: 'all 0.3s',
                textAlign: 'center',
                minWidth: 100,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(96, 165, 250, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>
                {currentStep > idx + 1 ? '✓' : idx + 1}
              </div>
              {step}
            </div>
          ))}
        </div>

        {/* MAIN ACTION AREA */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: 24,
          padding: 60,
          backdropFilter: 'blur(10px)',
          marginBottom: 40,
        }}>
          {/* UPLOAD SECTION */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 20px 0' }}>
                📸 {t.uploadBtn}
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: 30, fontSize: 14 }}>
                {t.uploadHint}
              </p>
              <div style={{
                border: '2px dashed rgba(96, 165, 250, 0.3)',
                borderRadius: 16,
                padding: 80,
                background: 'rgba(15, 23, 42, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)'
                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)'
              }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>⬆️</div>
                <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                  {lang === 'es' ? 'Arrastra o haz clic para seleccionar' : 'Drag or click to select'}
                </p>
              </div>
            </div>
          )}

          {/* CONSENT SECTION */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                ✓ {lang === 'es' ? 'Consentimiento' : 'Consent'}
              </h3>
              <div style={{ textAlign: 'left', maxWidth: 500, margin: '0 auto' }}>
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
                  <span>{lang === 'es' 
                    ? 'Acepto los términos y condiciones'
                    : 'I accept terms & conditions'}</span>
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
                  <span>{lang === 'es' 
                    ? 'Autorizo usar mis fotos para mejorar IA'
                    : 'I authorize to use photos to improve AI'}</span>
                </label>
              </div>
            </div>
          )}

          {/* STYLE SECTION */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                🎨 {lang === 'es' ? 'Elige Estilo' : 'Choose Style'}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 16,
              }}>
                {['Realista', 'Artístico', 'Cartoon', 'Cinematic'].map((style) => (
                  <button
                    key={style}
                    style={{
                      padding: 20,
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '2px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: 12,
                      color: '#93c5fd',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'
                      e.currentTarget.style.borderColor = '#60a5fa'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GENERATE SECTION */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                ⚡ {lang === 'es' ? 'Generando...' : 'Generating...'}
              </h3>
              <div style={{
                width: 60,
                height: 60,
                border: '4px solid rgba(96, 165, 250, 0.2)',
                borderTopColor: '#60a5fa',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ marginTop: 20, color: '#94a3b8' }}>
                {lang === 'es' ? 'Procesando tu foto...' : 'Processing your photo...'}
              </p>
            </div>
          )}

          {/* PREVIEW SECTION */}
          {currentStep === 5 && (
            <div>
              <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                👁️ {lang === 'es' ? 'Revisar' : 'Preview'}
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
              }}>
                🖼️
              </div>
            </div>
          )}

          {/* PAYMENT SECTION */}
          {currentStep === 6 && (
            <div>
              <h3 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 30px 0' }}>
                💳 {lang === 'es' ? 'Pagar' : 'Payment'}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
              }}>
                {[
                  { n: 1, p: 200, txt: '1 foto' },
                  { n: 2, p: 350, txt: '2 fotos' },
                  { n: 3, p: 500, txt: '3 fotos' },
                  { n: 10, p: 1000, txt: '10 fotos' },
                ].map((plan) => (
                  <button
                    key={plan.p}
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
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
                    {plan.txt}
                    <div style={{ fontSize: 20, marginTop: 8 }}>
                      ${plan.p} MXN
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          marginBottom: 40,
        }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              padding: '14px 28px',
              background: currentStep === 1 ? 'rgba(100, 116, 139, 0.2)' : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${currentStep === 1 ? 'rgba(100, 116, 139, 0.2)' : 'rgba(59, 130, 246, 0.3)'}`,
              color: currentStep === 1 ? '#64748b' : '#60a5fa',
              borderRadius: 12,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: currentStep === 1 ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              if (currentStep > 1) {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
            }}
          >
            {t.backBtn}
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
            disabled={currentStep === 6}
            style={{
              padding: '14px 28px',
              background: currentStep === 6
                ? 'rgba(100, 116, 139, 0.2)'
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: currentStep === 6 ? '1px solid rgba(100, 116, 139, 0.2)' : 'none',
              color: '#fff',
              borderRadius: 12,
              cursor: currentStep === 6 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: currentStep === 6 ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              if (currentStep < 6) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.4)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {t.nextBtn}
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        background: 'rgba(15, 23, 42, 0.8)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '40px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 14,
      }}>
        <p style={{ margin: 0 }}>
          {lang === 'es'
            ? '© Studio Nexora Comet 2025 | Aviso legal: No guardamos tus fotos. Descargar antes de salir.'
            : '© Studio Nexora Comet 2025 | Disclaimer: We don\'t store photos. Download before leaving.'}
        </p>
      </footer>

      {/* COPILOT WIDGET */}
      <button
        onClick={() => setShowCopilot(!showCopilot)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          border: 'none',
          borderRadius: '50%',
          color: '#fff',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          transition: 'all 0.3s',
          zIndex: 1000,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        🤖
      </button>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

