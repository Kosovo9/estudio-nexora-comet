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
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageBase64,
      style,
    }),
  })

  const { url } = await response.json()
  return url
}

