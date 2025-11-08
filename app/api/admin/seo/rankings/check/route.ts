import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)

export async function POST() {
  try {
    // Ejecutar script de ranking check
    const scriptPath = path.join(process.cwd(), 'scripts', 'seo-ranking-check.js')
    
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { success: false, error: 'Ranking check script not found' },
        { status: 404 }
      )
    }

    // Ejecutar script
    await execAsync(`node ${scriptPath}`)

    // Leer resultados
    const resultsPath = path.join(process.cwd(), 'seo-ranking-results.json')
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
      const found = results.filter((r: any) => r.found)
      
      return NextResponse.json({
        success: true,
        total: results.length,
        found: found.length,
        rankings: results,
      })
    }

    return NextResponse.json({
      success: true,
      total: 0,
      found: 0,
      rankings: [],
    })
  } catch (error: any) {
    console.error('Error checking rankings:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check rankings',
      },
      { status: 500 }
    )
  }
}

