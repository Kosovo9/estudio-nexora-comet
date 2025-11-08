import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get affiliate stats from database
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (affiliateError && affiliateError.code !== 'PGRST116') {
      console.error('Error fetching affiliate data:', affiliateError)
    }

    // Get referrals
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('affiliate_id', userId)
      .order('created_at', { ascending: false })

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError)
    }

    // Calculate stats
    const totalReferrals = referrals?.length || 0
    const successfulReferrals = referrals?.filter((r) => r.status === 'completed').length || 0
    const totalEarnings = referrals?.reduce((sum, r) => sum + (r.commission_amount || 0), 0) || 0
    const pendingEarnings = referrals?.filter((r) => r.status === 'pending').reduce((sum, r) => sum + (r.commission_amount || 0), 0) || 0
    const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0

    // Recent activity
    const recentActivity = (referrals || []).slice(0, 10).map((r) => ({
      type: r.status === 'completed' ? 'Commission Earned' : 'Referral Pending',
      description: `Referral from ${r.referral_email || 'user'}`,
      amount: r.commission_amount || 0,
      date: r.created_at,
    }))

    return NextResponse.json({
      totalReferrals,
      totalEarnings,
      pendingEarnings,
      conversionRate,
      recentActivity,
    })
  } catch (error: any) {
    console.error('Error fetching affiliate stats:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

