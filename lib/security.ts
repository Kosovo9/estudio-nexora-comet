// Security & Anti-Hack/Scraping Protection
// Rate limiting, bot detection, watermarking, fingerprinting

import { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  identifier?: string // Custom identifier (default: IP)
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options: RateLimitOptions) {
  return async (request: NextRequest): Promise<{ allowed: boolean; remaining: number; resetAt: number }> => {
    const identifier = options.identifier || getClientIdentifier(request)
    const now = Date.now()
    const key = `${identifier}:${options.windowMs}`

    // Clean up expired entries
    cleanupRateLimitStore(now)

    const entry = rateLimitStore.get(key)

    if (!entry || entry.resetAt < now) {
      // New window
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      })
      return {
        allowed: true,
        remaining: options.maxRequests - 1,
        resetAt: now + options.windowMs,
      }
    }

    if (entry.count >= options.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      }
    }

    // Increment count
    entry.count++
    rateLimitStore.set(key, entry)

    return {
      allowed: true,
      remaining: options.maxRequests - entry.count,
      resetAt: entry.resetAt,
    }
  }
}

/**
 * Get client identifier (IP + User-Agent hash)
 */
export function getClientIdentifier(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Simple hash
  const hash = simpleHash(`${ip}:${userAgent}`)
  return hash
}

/**
 * Simple hash function
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimitStore(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Bot detection based on User-Agent and headers
 */
export function detectBot(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http/i,
    /httpclient/i,
  ]

  // Check User-Agent
  if (botPatterns.some((pattern) => pattern.test(userAgent))) {
    return true
  }

  // Check for missing common browser headers
  const accept = request.headers.get('accept')
  const acceptLanguage = request.headers.get('accept-language')
  const acceptEncoding = request.headers.get('accept-encoding')

  if (!accept || !acceptLanguage || !acceptEncoding) {
    return true // Suspicious
  }

  return false
}

/**
 * Generate unique watermark/hash for images
 */
export function generateImageHash(userId: string, timestamp: number, imageData: string): string {
  const data = `${userId}:${timestamp}:${imageData.substring(0, 100)}`
  return simpleHash(data)
}

/**
 * Add watermark to image (canvas-based)
 */
export async function addWatermarkToImage(
  imageUrl: string,
  watermarkText: string,
  options?: { opacity?: number; fontSize?: number; position?: 'bottom-right' | 'center' }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Draw image
      ctx.drawImage(img, 0, 0)

      // Add watermark
      ctx.fillStyle = `rgba(255, 255, 255, ${options?.opacity || 0.5})`
      ctx.font = `${options?.fontSize || 24}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const x = options?.position === 'center' 
        ? canvas.width / 2 
        : canvas.width - 150
      const y = options?.position === 'center'
        ? canvas.height / 2
        : canvas.height - 30

      ctx.fillText(watermarkText, x, y)

      // Convert to data URL
      const watermarkedUrl = canvas.toDataURL('image/png')
      resolve(watermarkedUrl)
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

/**
 * Device fingerprinting
 */
export function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server'
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Fingerprint', 2, 2)
  }

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.deviceMemory || 'unknown',
  ].join('|')

  return simpleHash(fingerprint)
}

/**
 * Log suspicious activity
 */
export async function logSuspiciousActivity(
  request: NextRequest,
  reason: string,
  metadata?: Record<string, any>
): Promise<void> {
  const identifier = getClientIdentifier(request)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Log to database (Supabase)
  try {
    await fetch('/api/security/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier,
        ip,
        userAgent,
        reason,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Failed to log suspicious activity:', error)
  }
}

/**
 * Check if IP is blocked
 */
export async function isIPBlocked(ip: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/security/check-block?ip=${ip}`)
    if (response.ok) {
      const data = await response.json()
      return data.blocked || false
    }
  } catch (error) {
    console.error('Error checking IP block:', error)
  }
  return false
}

