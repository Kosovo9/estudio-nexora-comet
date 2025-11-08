import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data, timestamp, userId, sessionId } = body

    // Insert into Supabase logs table (create if doesn't exist)
    const { error } = await supabase.from('user_logs').insert({
      event,
      data: data || {},
      timestamp: timestamp || new Date().toISOString(),
      user_id: userId || null,
      session_id: sessionId || null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      // If table doesn't exist, log to console (for development)
      console.error('Error inserting log:', error)
      console.log('Log event:', { event, data, timestamp, userId, sessionId })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in log API:', error)
    return NextResponse.json({ success: false, error: 'Failed to log event' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get logs for admin dashboard
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const event = searchParams.get('event')

    let query = supabase.from('user_logs').select('*').order('created_at', { ascending: false })

    if (event) {
      query = query.eq('event', event)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      console.error('Error fetching logs:', error)
      return NextResponse.json({ logs: [] })
    }

    return NextResponse.json({ logs: data || [] })
  } catch (error) {
    console.error('Error in log API GET:', error)
    return NextResponse.json({ logs: [] })
  }
}

