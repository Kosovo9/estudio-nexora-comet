import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const rankingsPath = path.join(process.cwd(), 'seo-ranking-results.json')

    if (!fs.existsSync(rankingsPath)) {
      return NextResponse.json({ rankings: [] })
    }

    const rankings = JSON.parse(fs.readFileSync(rankingsPath, 'utf8'))

    return NextResponse.json({
      rankings: rankings.sort((a: any, b: any) => {
        if (a.found && !b.found) return -1
        if (!a.found && b.found) return 1
        if (a.found && b.found) return (a.rank || 0) - (b.rank || 0)
        return 0
      }),
    })
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return NextResponse.json({ rankings: [] })
  }
}

