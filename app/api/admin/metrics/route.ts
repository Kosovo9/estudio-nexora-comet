import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check
    // if (!isAdmin(userId)) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    const daysAgo = range === '1d' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Fetch metrics from database
    const { data: generations, error: genError } = await supabase
      .from('generations')
      .select('*')
      .gte('created_at', startDate.toISOString())

    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (genError || payError) {
      console.error('Error fetching metrics:', genError || payError)
    }

    // Calculate metrics
    const totalGenerations = generations?.length || 0
    const successfulGenerations = generations?.filter((g) => g.image_url).length || 0
    const failedGenerations = totalGenerations - successfulGenerations
    const conversions = payments?.filter((p) => p.status === 'completed').length || 0

    // Calculate average time (mock for now - would need timing data)
    const averageTime = 15.5

    // Get unique users
    const uniqueUsers = new Set(generations?.map((g) => g.user_id) || []).size

    // Count blocking detections (would need error logs)
    const blockingDetections = 0 // TODO: Count from error logs

    // Count errors
    const errors = failedGenerations

    const metrics = {
      totalGenerations,
      successfulGenerations,
      failedGenerations,
      averageTime,
      totalUsers: uniqueUsers,
      blockingDetections,
      conversions,
      errors,
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

