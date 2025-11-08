import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // En producción, esto vendría de una base de datos
    // Por ahora, simulamos datos o leemos de archivos

    const alertsPath = path.join(process.cwd(), 'seo-alerts.json')
    let scores: any[] = []

    // Si hay alertas, generar scores desde ellas
    if (fs.existsSync(alertsPath)) {
      const alerts = JSON.parse(fs.readFileSync(alertsPath, 'utf8'))
      scores = alerts.map((alert: any) => ({
        seo: alert.seoScore,
        accessibility: alert.accessibilityScore,
        performance: alert.performanceScore,
        date: alert.date,
      }))
    }

    // Score actual (último o simulado)
    const current = scores.length > 0
      ? scores[scores.length - 1]
      : {
          seo: 95,
          accessibility: 92,
          performance: 88,
          date: new Date().toISOString(),
        }

    return NextResponse.json({
      scores: scores.slice(-10), // Últimos 10
      current,
    })
  } catch (error) {
    console.error('Error fetching SEO scores:', error)
    return NextResponse.json({
      scores: [],
      current: {
        seo: 0,
        accessibility: 0,
        performance: 0,
        date: new Date().toISOString(),
      },
    })
  }
}

