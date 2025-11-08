'use client'

import { useState } from 'react'
import { type Language } from '@/lib/i18n'
import { CreditCard, Globe } from 'lucide-react'

interface FooterNexoraProps {
  lang: Language
  setLang: (lang: Language) => void
}

const pricingPlans = [
  { n: 1, txt: '1 foto por $200 MXN', txtEn: '1 photo for $200 MXN', price: 200 },
  { n: 2, txt: '2 fotos por $350 MXN', txtEn: '2 photos for $350 MXN', price: 350 },
  { n: 3, txt: '3 fotos por $500 MXN', txtEn: '3 photos for $500 MXN', price: 500 },
  { n: 10, txt: '10 fotos por $1000 MXN', txtEn: '10 photos for $1000 MXN', price: 1000 },
]

export default function FooterNexora({ lang, setLang }: FooterNexoraProps) {
  const handlePayment = async (plan: typeof pricingPlans[0]) => {
    // Redirigir a página de pago o abrir modal
    window.location.href = `/payment?plan=${plan.n}&price=${plan.price}`
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 relative border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* Pricing Plans */}
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          {pricingPlans.map((plan) => (
            <div
              key={plan.n}
              className="bg-gray-800 rounded-xl p-4 min-w-[185px] shadow-lg border border-gray-700 hover:border-blue-500 transition-all"
            >
              <div className="text-xl text-blue-300 mb-2 font-semibold">
                {lang === 'es' ? 'Plan' : 'Plan'} {plan.n}
              </div>
              <div className="text-sm font-semibold mb-3">
                {lang === 'es' ? plan.txt : plan.txtEn}
              </div>
              <button
                onClick={() => handlePayment(plan)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg py-2 px-4 font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{lang === 'es' ? 'Pagar' : 'Pay'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Language Switch */}
        <div className="text-center mb-4">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="mx-auto bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg border border-gray-700 transition-all flex items-center space-x-2"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'es' ? 'English' : 'Español'}</span>
          </button>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-xs max-w-2xl mx-auto mt-4 mb-4 text-green-400 text-center px-4">
          {lang === 'es' ? (
            <>
              <strong>Aviso legal:</strong> No guardamos tus fotos ni tus datos. Descarga todo antes de salir — las imágenes se eliminan a las 24h. Responsabilidad absoluta del usuario. Chat AI 24/7 no reemplaza soporte humano profesional.
            </>
          ) : (
            <>
              <strong>Disclaimer:</strong> We don&apos;t store your photos or data. Download before leaving — images are erased after 24h. Full user responsibility. 24/7 AI chat does not replace professional support.
            </>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-blue-300 mt-4">
          {lang === 'es' ? (
            <>Studio Nexora Comet - Todos los derechos reservados. México/global.</>
          ) : (
            <>Studio Nexora Comet - All rights reserved. Global/Mexico</>
          )}
        </div>

        {/* Links */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <a href="/affiliates" className="text-blue-400 hover:text-blue-300 transition-colors">
            {lang === 'es' ? 'Afiliados' : 'Affiliates'}
          </a>
          <a href="/white-pages" className="text-blue-400 hover:text-blue-300 transition-colors">
            {lang === 'es' ? 'White Pages' : 'White Pages'}
          </a>
          <a href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
            {lang === 'es' ? 'Admin' : 'Admin'}
          </a>
          <a href="mailto:support@studio-nexora.com" className="text-blue-400 hover:text-blue-300 transition-colors">
            {lang === 'es' ? 'Soporte' : 'Support'}
          </a>
        </div>
      </div>
    </footer>
  )
}

