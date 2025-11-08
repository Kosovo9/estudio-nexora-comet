'use client'

import { useState } from 'react'
import { CreditCard, Building2, Check } from 'lucide-react'
import { getTexts, type Language } from '@/lib/i18n'
import OnboardingMini from './OnboardingMini'

interface PaymentFormProps {
  onComplete: () => void
  imageUrl: string | null
  language?: Language
}

export default function PaymentForm({ onComplete, imageUrl, language }: PaymentFormProps) {
  const texts = getTexts(language)
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'stripe' | null>(null)
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    reference: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Save payment to Supabase
      const response = await fetch('/api/payments/bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bankDetails,
          imageUrl,
        }),
      })

      if (response.ok) {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000))
        onComplete()
      } else {
        throw new Error('Payment submission failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Error processing payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStripePayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Stripe error:', error)
      alert('Error initiating payment. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{texts.payment}</h2>
      <p className="text-gray-400 mb-6">
        {language === 'es'
          ? 'Elige tu método de pago para descargar sin marca de agua'
          : 'Choose your payment method to download without watermark'}
      </p>

      {/* Onboarding Mini for Payment */}
      {!paymentMethod && (
        <OnboardingMini lang={language || 'es'} step="pay" />
      )}

      {!paymentMethod ? (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <button
            onClick={() => setPaymentMethod('bank')}
            className="p-6 rounded-xl border-2 border-gray-700 hover:border-blue-500 bg-gray-800/50 transition-all text-left"
          >
            <Building2 className="w-12 h-12 mb-4 text-blue-400" />
            <h3 className="text-xl font-bold mb-2">Bank Transfer (MX)</h3>
            <p className="text-gray-400 text-sm">
              Transfer to Mexican bank account. Manual verification required.
            </p>
          </button>

          <button
            onClick={() => setPaymentMethod('stripe')}
            className="p-6 rounded-xl border-2 border-gray-700 hover:border-blue-500 bg-gray-800/50 transition-all text-left"
          >
            <CreditCard className="w-12 h-12 mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">Credit Card (Stripe)</h3>
            <p className="text-gray-400 text-sm">
              Instant payment with credit or debit card.
            </p>
          </button>
        </div>
      ) : paymentMethod === 'bank' ? (
        <form onSubmit={handleBankSubmit} className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-6 mb-4">
            <h3 className="font-bold mb-4">Bank Transfer Details</h3>
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p><strong>Bank:</strong> Banco de México</p>
              <p><strong>Account:</strong> 1234567890123456</p>
              <p><strong>CLABE:</strong> 012345678901234567</p>
              <p><strong>Amount:</strong> $299 MXN</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              required
              value={bankDetails.accountName}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, accountName: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Your Account Number
            </label>
            <input
              type="text"
              required
              value={bankDetails.accountNumber}
              onChange={(e) =>
                setBankDetails({
                  ...bankDetails,
                  accountNumber: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Your account number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bank Name</label>
            <input
              type="text"
              required
              value={bankDetails.bankName}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, bankName: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Your bank name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Transfer Reference
            </label>
            <input
              type="text"
              required
              value={bankDetails.reference}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, reference: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Reference number from transfer"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setPaymentMethod(null)}
              className="flex-1 px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Submit Payment</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
            <h3 className="font-bold mb-4">Credit Card Payment</h3>
            <p className="text-gray-400 text-sm mb-4">
              You will be redirected to Stripe for secure payment processing.
            </p>
            <p className="text-2xl font-bold">$299 MXN</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setPaymentMethod(null)}
              className="flex-1 px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleStripePayment}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay with Stripe</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

