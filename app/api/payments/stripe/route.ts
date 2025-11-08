import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageUrl } = await request.json()

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Studio Nexora Comet - AI Generated Image',
              description: 'Download high-resolution image without watermark',
            },
            unit_amount: 29900, // $299 MXN in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment-cancel`,
      metadata: {
        userId,
        imageUrl,
      },
    })

    // Save payment record
    await supabase.from('payments').insert({
      user_id: userId,
      payment_method: 'stripe',
      amount: 299,
      currency: 'MXN',
      status: 'pending',
      stripe_session_id: session.id,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

