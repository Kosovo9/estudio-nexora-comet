import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageUrl, expiresIn } = await request.json()

    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Save to temporary downloads table
    const { data, error } = await supabase
      .from('temp_downloads')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Temp download error:', error)
      // Fallback: return original URL
      return NextResponse.json({ downloadUrl: imageUrl })
    }

    // Generate temporary download URL (valid for 24h)
    const downloadUrl = `/api/temp-download/${data.id}`

    return NextResponse.json({ downloadUrl, expiresAt: expiresAt.toISOString() })
  } catch (error) {
    console.error('Temp download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

