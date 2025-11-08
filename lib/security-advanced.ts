// Advanced Security - 2FA, Rate Limiting, Fingerprinting

import { NextRequest } from 'next/server'
import { rateLimit, detectBot, logSuspiciousActivity } from './security'

export async function checkSecurity(request: NextRequest): Promise<{ allowed: boolean; reason?: string }> {
  // Rate limiting
  const limit = await rateLimit({
    windowMs: 60000,
    maxRequests: 10,
  })(request)

  if (!limit.allowed) {
    await logSuspiciousActivity(request, 'rate_limit_exceeded')
    return { allowed: false, reason: 'Rate limit exceeded' }
  }

  // Bot detection
  if (detectBot(request)) {
    await logSuspiciousActivity(request, 'bot_detected')
    return { allowed: false, reason: 'Bot detected' }
  }

  return { allowed: true }
}

export async function verify2FA(userId: string, code: string): Promise<boolean> {
  // In production, verify with authenticator app or SMS
  const response = await fetch('/api/auth/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, code }),
  })
  return response.ok
}

