import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createSignedUrl } from '@/lib/storage-secure'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bucket, path, expiresIn } = await request.json()

    if (!bucket || !path) {
      return NextResponse.json(
        { error: 'Missing bucket or path' },
        { status: 400 }
      )
    }

    // Verify user owns the file (path should start with userId/)
    if (!path.startsWith(`${userId}/`)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const signedUrl = await createSignedUrl(bucket, path, expiresIn || 86400)

    return NextResponse.json({ signedUrl })
  } catch (error: any) {
    console.error('Signed URL error:', error)
    return NextResponse.json(
      { error: 'Failed to create signed URL', details: error.message },
      { status: 500 }
    )
  }
}

