import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ip = searchParams.get('ip')

    if (!ip) {
      return NextResponse.json({ error: 'Missing IP parameter' }, { status: 400 })
    }

    // Check if IP is blocked (has recent blocked logs)
    const { data, error } = await supabase
      .from('security_logs')
      .select('id, created_at')
      .eq('ip_address', ip)
      .eq('blocked', true)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking IP block:', error)
      return NextResponse.json(
        { error: 'Failed to check IP block status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ blocked: !!data })
  } catch (error: any) {
    console.error('Check block error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

