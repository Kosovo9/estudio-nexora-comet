export async function generateAI(images: File[], style: 'dark-studio' | 'paris-cafe'): Promise<string> {
  try {
    // For MVP: Process and upload the first image with style transformation
    // In production, integrate with Google Imagen API or similar image generation service
    // For now, we'll upload the processed image to Supabase
    
    // Convert first image to base64 and upload
    const processedImage = await processImageWithStyle(images[0], style)
    const supabaseUrl = await uploadToSupabase(processedImage, style)
    return supabaseUrl
  } catch (error) {
    console.error('AI Generation error:', error)
    throw error
  }
}

async function processImageWithStyle(image: File, style: string): Promise<string> {
  // For MVP: Return base64 of the image
  // In production, this would call Google Imagen API or similar
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(image)
  })
}

async function uploadToSupabase(imageBase64: string, style: string): Promise<string> {
  // Abort controller para timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 20000) // 20 segundos timeout

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageBase64,
        style,
      }),
      signal: controller.signal, // Agregar signal para abort
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.url) {
      throw new Error('No URL returned from upload')
    }

    return data.url
  } catch (error: any) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      throw new Error('Upload timeout - The operation is taking too long. Please check your connection and try again.')
    }
    
    // Re-throw with more context if possible
    if (error.message) {
      throw error
    }
    
    throw new Error('Upload failed - Unknown error occurred')
  }
}

