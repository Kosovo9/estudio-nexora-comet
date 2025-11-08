import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { identifier, ip, userAgent, reason, metadata, timestamp } = await request.json()

    if (!identifier || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: identifier, reason' },
        { status: 400 }
      )
    }

    // Insert security log
    const { data, error } = await supabase
      .from('security_logs')
      .insert({
        identifier,
        ip_address: ip,
        user_agent: userAgent,
        reason,
        metadata: metadata || {},
        blocked: reason.includes('blocked') || reason.includes('rate_limit'),
        created_at: timestamp || new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error logging security event:', error)
      return NextResponse.json(
        { error: 'Failed to log security event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, logId: data.id })
  } catch (error: any) {
    console.error('Security log error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

