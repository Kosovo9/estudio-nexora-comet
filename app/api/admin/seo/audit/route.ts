import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)

export async function POST() {
  try {
    const url = process.env.NEXT_PUBLIC_APP_URL || 'https://studio-nexora.com'
    const outputPath = path.join(process.cwd(), 'seo-lh-temp.json')

    // Ejecutar Lighthouse
    const command = `npx lighthouse "${url}" --output json --output-path "${outputPath}" --chrome-flags="--headless" --only-categories=seo,accessibility,performance --quiet`

    await execAsync(command)

    // Leer resultados
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
    const seoScore = Math.round((data.categories?.seo?.score || 0) * 100)
    const accessibilityScore = Math.round((data.categories?.accessibility?.score || 0) * 100)
    const performanceScore = Math.round((data.categories?.performance?.score || 0) * 100)

    // Guardar en alertas si el score es bajo
    const threshold = 90
    if (seoScore < threshold) {
      const alertsPath = path.join(process.cwd(), 'seo-alerts.json')
      let alerts = []
      if (fs.existsSync(alertsPath)) {
        alerts = JSON.parse(fs.readFileSync(alertsPath, 'utf8'))
      }
      alerts.push({
        date: new Date().toISOString(),
        seoScore,
        accessibilityScore,
        performanceScore,
        url,
        threshold,
      })
      fs.writeFileSync(alertsPath, JSON.stringify(alerts, null, 2))
    }

    // Limpiar archivo temporal
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath)
    }

    return NextResponse.json({
      success: true,
      seoScore,
      accessibilityScore,
      performanceScore,
      message: 'SEO audit completed successfully',
    })
  } catch (error: any) {
    console.error('Error running SEO audit:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to run SEO audit',
      },
      { status: 500 }
    )
  }
}

