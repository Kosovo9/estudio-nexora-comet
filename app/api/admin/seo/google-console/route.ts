import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const resultsPath = path.join(process.cwd(), 'google-search-console-results.json')

    if (!fs.existsSync(resultsPath)) {
      return NextResponse.json({
        success: false,
        message: 'No Google Search Console data found. Run the script first.',
      })
    }

    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error: any) {
    console.error('Error fetching Google Search Console data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch Google Search Console data',
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Ejecutar script de Google Search Console
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)

    const scriptPath = path.join(process.cwd(), 'scripts', 'google-search-console.js')

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Search Console script not found',
        },
        { status: 404 }
      )
    }

    // Ejecutar script (en background)
    execAsync(`node ${scriptPath}`).catch((error: any) => {
      console.error('Error running Google Search Console script:', error)
    })

    return NextResponse.json({
      success: true,
      message: 'Google Search Console data fetch initiated. Check back in a few moments.',
    })
  } catch (error: any) {
    console.error('Error initiating Google Search Console fetch:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initiate Google Search Console fetch',
      },
      { status: 500 }
    )
  }
}

