import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get temporary download record
    const { data, error } = await supabase
      .from('temp_downloads')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 })
    }

    // Check if expired
    const expiresAt = new Date(data.expires_at)
    if (new Date() > expiresAt) {
      // Delete expired record
      await supabase.from('temp_downloads').delete().eq('id', id)
      return NextResponse.json({ error: 'Download expired' }, { status: 410 })
    }

    // Redirect to image URL
    return NextResponse.redirect(data.image_url)
  } catch (error) {
    console.error('Temp download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

