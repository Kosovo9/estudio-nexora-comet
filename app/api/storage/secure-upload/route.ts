import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { uploadSecureFile, createSignedUrl } from '@/lib/storage-secure'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'private-files'
    const isPublic = formData.get('isPublic') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create secure path: userId/filename
    const path = `${userId}/${Date.now()}-${file.name}`

    const result = await uploadSecureFile({
      bucket,
      path,
      file,
      contentType: file.type,
      isPublic,
    })

    // If not public, create signed URL
    let url = result.url
    if (!isPublic && !url) {
      url = await createSignedUrl(bucket, result.path, 86400) // 24h
    }

    return NextResponse.json({
      success: true,
      path: result.path,
      url,
    })
  } catch (error: any) {
    console.error('Secure upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    )
  }
}

