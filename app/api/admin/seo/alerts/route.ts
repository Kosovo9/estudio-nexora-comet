import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const alertsPath = path.join(process.cwd(), 'seo-alerts.json')

    if (!fs.existsSync(alertsPath)) {
      return NextResponse.json({ alerts: [] })
    }

    const alerts = JSON.parse(fs.readFileSync(alertsPath, 'utf8'))

    // Filtrar alertas de la última semana
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentAlerts = alerts.filter((alert: any) => {
      const alertDate = new Date(alert.date)
      return alertDate >= oneWeekAgo
    })

    return NextResponse.json({
      alerts: recentAlerts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    })
  } catch (error) {
    console.error('Error fetching SEO alerts:', error)
    return NextResponse.json({ alerts: [] })
  }
}

