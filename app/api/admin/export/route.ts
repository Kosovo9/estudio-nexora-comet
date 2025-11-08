import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    const daysAgo = range === '1d' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Fetch data
    const { data: generations } = await supabase
      .from('generations')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (format === 'csv') {
      // Generate CSV
      const csvRows = [
        ['Type', 'User ID', 'Style', 'Status', 'Created At', 'URL/Details'].join(','),
        ...(generations || []).map((g) =>
          [
            'Generation',
            g.user_id,
            g.style,
            g.image_url ? 'Success' : 'Failed',
            g.created_at,
            g.image_url || 'N/A',
          ].join(',')
        ),
        ...(payments || []).map((p) =>
          [
            'Payment',
            p.user_id,
            p.payment_method,
            p.status,
            p.created_at,
            p.amount + ' ' + p.currency,
          ].join(',')
        ),
      ]

      const csv = csvRows.join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="nexora-logs-${range}-${Date.now()}.csv"`,
        },
      })
    } else {
      // Generate PDF (simplified - use a PDF library in production)
      const pdfContent = `
Nexora Logs Report
Date Range: ${range}
Generated: ${new Date().toISOString()}

Generations: ${generations?.length || 0}
Payments: ${payments?.length || 0}

[PDF content would be generated here using a library like pdfkit or jsPDF]
      `.trim()

      return new NextResponse(pdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="nexora-logs-${range}-${Date.now()}.pdf"`,
        },
      })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

