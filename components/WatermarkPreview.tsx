'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Download, ArrowRight } from 'lucide-react'

interface WatermarkPreviewProps {
  imageUrl: string
  onContinue: () => void
}

export default function WatermarkPreview({ imageUrl, onContinue }: WatermarkPreviewProps) {
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null)

  useEffect(() => {
    // Create watermarked version
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        
        // Add watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, canvas.height - 80, canvas.width, 80)
        
        ctx.fillStyle = 'white'
        ctx.font = 'bold 24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Studio Nexora Comet', canvas.width / 2, canvas.height - 40)
        ctx.font = '16px Arial'
        ctx.fillText('Preview - Purchase to remove watermark', canvas.width / 2, canvas.height - 15)
        
        setWatermarkedUrl(canvas.toDataURL('image/png'))
      }
    }
    img.onerror = () => {
      // Fallback: use original image if watermarking fails
      setWatermarkedUrl(imageUrl)
    }
    img.src = imageUrl
  }, [imageUrl])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Watermark Preview</h2>
      <p className="text-gray-400 mb-6">
        This is a preview with watermark. Complete payment to download without watermark.
      </p>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        {watermarkedUrl ? (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={watermarkedUrl}
              alt="Watermarked preview"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-full aspect-square flex items-center justify-center">
            <div className="text-gray-500">Loading preview...</div>
          </div>
        )}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6">
        <p className="text-yellow-400 text-sm">
          ⚠️ This preview includes a watermark. Complete payment to download the
          full-resolution image without watermark.
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
      >
        <span>Continue to Payment</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

