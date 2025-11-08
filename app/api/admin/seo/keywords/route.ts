import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // En producción, esto vendría de una base de datos o análisis real
    // Por ahora, retornamos datos de ejemplo
    const keywords = [
      {
        url: 'https://studio-nexora.com/',
        title: 'AI-Powered Photo Studio Global | Studio Nexora Comet',
        keywords: ['ai photo', 'AI studio', 'imágenes', 'generator', 'edit', 'studio', 'AI', 'photo', 'marketplace'],
        h1: 'Studio Nexora Comet',
      },
      {
        url: 'https://studio-nexora.com/en',
        title: 'AI-Powered Photo Studio Global | Studio Nexora Comet',
        keywords: ['ai photo', 'AI studio', 'image generator', 'photo editor', 'marketplace'],
        h1: 'Studio Nexora Comet',
      },
      {
        url: 'https://studio-nexora.com/es',
        title: 'Estudio de Fotos con IA Global | Studio Nexora Comet',
        keywords: ['fotos IA', 'generador imágenes', 'editor fotos', 'marketplace', 'afiliados'],
        h1: 'Studio Nexora Comet',
      },
    ]

    return NextResponse.json({ keywords })
  } catch (error) {
    console.error('Error fetching keywords:', error)
    return NextResponse.json({ keywords: [] })
  }
}

