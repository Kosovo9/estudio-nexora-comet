import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { accountName, accountNumber, bankName, reference, imageUrl } =
      await request.json()

    // Save bank payment to database
    const { error } = await supabase.from('payments').insert({
      user_id: userId,
      payment_method: 'bank_transfer',
      amount: 299,
      currency: 'MXN',
      status: 'pending',
      bank_details: {
        account_name: accountName,
        account_number: accountNumber,
        bank_name: bankName,
        reference,
      },
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Payment save error:', error)
      return NextResponse.json(
        { error: 'Failed to save payment' },
        { status: 500 }
      )
    }

    // In production, you'd verify the bank transfer here
    // For MVP, we'll mark it as pending and require manual verification

    return NextResponse.json({
      success: true,
      message: 'Payment submitted. Awaiting verification.',
    })
  } catch (error) {
    console.error('Bank payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

