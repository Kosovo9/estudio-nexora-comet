import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const KEYWORDS_FILE = path.join(process.cwd(), 'seo-keywords.json')

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

export async function POST(request: Request) {
  try {
    const { keyword, country } = await request.json()

    if (!keyword || !country) {
      return NextResponse.json(
        { success: false, error: 'Keyword and country are required' },
        { status: 400 }
      )
    }

    let keywords: any[] = []
    if (fs.existsSync(KEYWORDS_FILE)) {
      keywords = JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf8'))
    }

    // Verificar duplicados
    const exists = keywords.some(
      (k: any) => k.keyword === keyword && k.country === country
    )
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Keyword already exists for this country' },
        { status: 400 }
      )
    }

    // Agregar nueva keyword
    keywords.push({
      keyword,
      country,
      createdAt: new Date().toISOString(),
    })

    fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(keywords, null, 2))

    return NextResponse.json({
      success: true,
      keyword: keywords[keywords.length - 1],
    })
  } catch (error: any) {
    console.error('Error adding keyword:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add keyword',
      },
      { status: 500 }
    )
  }
}

