import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { table, filters } = await request.json()

    if (!table) {
      return NextResponse.json({ error: 'Missing table' }, { status: 400 })
    }

    let query = supabase.from(table).select('*')

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase CMS error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch content', details: error.message },
        { status: 500 }
      )
    }

    // Transform to CMSContent format
    const results = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title || item.name || 'Untitled',
      content: item.content || item.body || item.description || '',
      type: item.type || item.category || 'page',
      metadata: item,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Supabase CMS error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

