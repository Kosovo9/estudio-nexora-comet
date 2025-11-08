import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Run QA tests
    try {
      const { stdout, stderr } = await execAsync('npm run test:e2e:full', {
        cwd: process.cwd(),
        timeout: 300000, // 5 minutes timeout
      })

      // Generate report
      await execAsync('npm run test:report', {
        cwd: process.cwd(),
      })

      return NextResponse.json({
        success: true,
        message: 'QA tests completed successfully',
        reportUrl: '/cypress/reports/html/mochawesome.html',
        output: stdout,
      })
    } catch (error: any) {
      console.error('QA execution error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'QA tests failed',
          details: error.message,
          output: error.stdout || error.stderr,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('QA route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

