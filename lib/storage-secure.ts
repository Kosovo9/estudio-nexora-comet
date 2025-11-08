// Secure Storage with Private Buckets and Temporary Links
// Supabase Storage with RBAC and RLS

import { supabase } from './supabase'

export interface UploadOptions {
  bucket: string
  path: string
  file: File | Blob
  contentType?: string
  isPublic?: boolean
}

/**
 * Upload file to secure private bucket
 */
export async function uploadSecureFile(options: UploadOptions): Promise<{ path: string; url?: string }> {
  const { bucket, path, file, contentType, isPublic = false } = options

  try {
    // Upload to private bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // If public, get public URL
    if (isPublic) {
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path)

      return { path: data.path, url: publicUrl }
    }

    return { path: data.path }
  } catch (error: any) {
    console.error('Secure upload error:', error)
    throw error
  }
}

/**
 * Generate temporary signed URL (24h default)
 */
export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 86400 // 24 hours in seconds
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`)
    }

    return data.signedUrl
  } catch (error: any) {
    console.error('Signed URL error:', error)
    throw error
  }
}

/**
 * Delete secure file
 */
export async function deleteSecureFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }

    return true
  } catch (error: any) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * List files in secure bucket (with RLS)
 */
export async function listSecureFiles(
  bucket: string,
  folder?: string
): Promise<Array<{ name: string; id: string; created_at: string }>> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder || '', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (error) {
      throw new Error(`List failed: ${error.message}`)
    }

    return data || []
  } catch (error: any) {
    console.error('List files error:', error)
    return []
  }
}

