import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { sendConversionEmail } from '@/lib/email'

// Track referral when user signs up or makes a purchase
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { referralCode, eventType, amount, transactionId } = await request.json()

    if (!referralCode || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: referralCode, eventType' },
        { status: 400 }
      )
    }

    // Find affiliate by referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('referral_code', referralCode)
      .single()

    if (affiliateError || !affiliate) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    // Calculate commission (20%)
    const commissionAmount = amount ? amount * 0.2 : 0

    // Create referral record
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .insert({
        affiliate_id: affiliate.user_id,
        referral_user_id: userId || null,
        commission_amount: commissionAmount,
        status: eventType === 'payment_completed' ? 'completed' : 'pending',
        transaction_type: eventType,
        transaction_id: transactionId || null,
      })
      .select('id')
      .single()

    if (referralError) {
      console.error('Error creating referral:', referralError)
      return NextResponse.json(
        { error: 'Failed to track referral' },
        { status: 500 }
      )
    }

    // Update affiliate stats
    await supabase
      .from('affiliates')
      .update({
        total_referrals: (affiliate.total_referrals || 0) + 1,
        total_earnings: eventType === 'payment_completed'
          ? (affiliate.total_earnings || 0) + commissionAmount
          : affiliate.total_earnings,
        pending_earnings: eventType === 'payment_completed'
          ? affiliate.pending_earnings
          : (affiliate.pending_earnings || 0) + commissionAmount,
      })
      .eq('id', affiliate.id)

    // Send email notification to affiliate if commission earned
    if (eventType === 'payment_completed' && commissionAmount > 0) {
      // Get affiliate user email (would need to fetch from Clerk or store in affiliates table)
      // For now, we'll skip the email or use a placeholder
      // await sendConversionEmail({
      //   to: affiliateEmail,
      //   eventType: 'affiliate_earned',
      //   metadata: { amount: commissionAmount },
      // })
    }

    return NextResponse.json({ success: true, referralId: referral.id })
  } catch (error: any) {
    console.error('Referral tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

