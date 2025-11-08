'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Download } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      // Fetch payment details and image URL
      fetch(`/api/payments/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.imageUrl) {
            setImageUrl(data.imageUrl)
          }
        })
        .catch(console.error)
    }
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-6">
          Your payment has been processed successfully.
        </p>
        {imageUrl && (
          <a
            href={imageUrl}
            download
            className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Download Without Watermark</span>
          </a>
        )}
        <Link
          href="/"
          className="block mt-4 text-blue-400 hover:text-blue-300"
        >
          Create Another Image
        </Link>
      </div>
    </div>
  )
}

