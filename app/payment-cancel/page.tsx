'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-400 mb-6">
          Your payment was cancelled. You can try again anytime.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-all"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

