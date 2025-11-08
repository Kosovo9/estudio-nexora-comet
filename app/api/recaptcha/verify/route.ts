import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured')
      return NextResponse.json({ error: 'reCAPTCHA not configured' }, { status: 500 })
    }

    // Verify token with Google
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      {
        method: 'POST',
      }
    )

    const data = await response.json()

    return NextResponse.json({
      success: data.success || false,
      score: data.score || 0,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
    })
  } catch (error: any) {
    console.error('reCAPTCHA verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

