import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('copilot_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching copilot history:', error)
      return NextResponse.json({ messages: [] })
    }

    const messages = (data || []).map((item: any) => ({
      id: item.id,
      role: 'user' as const,
      content: item.message,
      timestamp: new Date(item.created_at),
    })).concat(
      (data || []).map((item: any) => ({
        id: item.id + '_response',
        role: 'assistant' as const,
        content: item.response,
        timestamp: new Date(item.created_at),
      }))
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error('Copilot history error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

