import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BACKLINKS_FILE = path.join(process.cwd(), 'seo-backlinks.json')

export async function GET() {
  try {
    if (!fs.existsSync(BACKLINKS_FILE)) {
      return NextResponse.json({ backlinks: [] })
    }

    const backlinks = JSON.parse(fs.readFileSync(BACKLINKS_FILE, 'utf8'))

    return NextResponse.json({
      backlinks: backlinks.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      }),
    })
  } catch (error) {
    console.error('Error fetching backlinks:', error)
    return NextResponse.json({ backlinks: [] })
  }
}

export async function POST(request: Request) {
  try {
    const { name, url } = await request.json()

    if (!name || !url) {
      return NextResponse.json(
        { success: false, error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    let backlinks = []
    if (fs.existsSync(BACKLINKS_FILE)) {
      backlinks = JSON.parse(fs.readFileSync(BACKLINKS_FILE, 'utf8'))
    }

    // Verificar duplicados
    const exists = backlinks.some((b: any) => b.name === name || b.url === url)
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Backlink already exists' },
        { status: 400 }
      )
    }

    // Agregar nuevo backlink
    backlinks.push({
      name,
      url,
      method: 'MANUAL',
      description: 'Manually added backlink',
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    fs.writeFileSync(BACKLINKS_FILE, JSON.stringify(backlinks, null, 2))

    return NextResponse.json({
      success: true,
      backlink: backlinks[backlinks.length - 1],
    })
  } catch (error: any) {
    console.error('Error adding backlink:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add backlink',
      },
      { status: 500 }
    )
  }
}

