import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { template, customization, tenantId } = await request.json()

    if (!template || !customization) {
      return NextResponse.json(
        { error: 'Missing required fields: template, customization' },
        { status: 400 }
      )
    }

    // Save or update white page
    const { data, error } = await supabase
      .from('white_pages')
      .upsert({
        user_id: userId,
        tenant_id: tenantId || null,
        template_id: template,
        customization,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error saving white page:', error)
      return NextResponse.json(
        { error: 'Failed to save white page' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error: any) {
    console.error('White page save error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

