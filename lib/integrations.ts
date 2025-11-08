// Integration helpers for CRM, Email, and Affiliates
// Call these functions at key events in your app

import { addLeadToCRM, trackConversionInCRM } from './crm'
import { sendConversionEmail } from './email'
import { supabase } from './supabase'

/**
 * Track user registration
 * Call this when a new user signs up
 */
export async function trackRegistration(userId: string, email: string, name?: string): Promise<void> {
  try {
    // Track in CRM
    await trackConversionInCRM(email, 'registration', {
      userId,
      name,
      timestamp: new Date().toISOString(),
    })

    // Send welcome email
    await sendConversionEmail({
      to: email,
      userName: name,
      eventType: 'registration',
    })

    // Check for referral code in URL/localStorage
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const refCode = urlParams.get('ref')
      if (refCode) {
        // Track referral
        await fetch('/api/referrals/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralCode: refCode,
            eventType: 'registration',
          }),
        })
      }
    }
  } catch (error) {
    console.error('Error tracking registration:', error)
  }
}

/**
 * Track photo generation
 * Call this when a photo is successfully generated
 */
export async function trackPhotoGeneration(
  userId: string,
  email: string,
  imageUrl: string,
  style: string
): Promise<void> {
  try {
    // Track in CRM
    await trackConversionInCRM(email, 'photo_generated', {
      userId,
      imageUrl,
      style,
      timestamp: new Date().toISOString(),
    })

    // Send notification email
    await sendConversionEmail({
      to: email,
      eventType: 'photo_ready',
      metadata: { imageUrl, style },
    })
  } catch (error) {
    console.error('Error tracking photo generation:', error)
  }
}

/**
 * Track payment completion
 * Call this when a payment is successfully completed
 */
export async function trackPaymentCompletion(
  userId: string,
  email: string,
  amount: number,
  paymentMethod: string,
  transactionId?: string
): Promise<void> {
  try {
    // Track in CRM
    await trackConversionInCRM(email, 'payment_completed', {
      userId,
      amount,
      paymentMethod,
      transactionId,
      timestamp: new Date().toISOString(),
    })

    // Send confirmation email
    await sendConversionEmail({
      to: email,
      eventType: 'payment_completed',
      metadata: { amount, paymentMethod },
    })

    // Check for referral and track commission
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const refCode = urlParams.get('ref')
      if (refCode) {
        // Track referral commission (20%)
        await fetch('/api/referrals/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralCode: refCode,
            eventType: 'payment_completed',
            amount,
            transactionId,
          }),
        })
      }
    }
  } catch (error) {
    console.error('Error tracking payment completion:', error)
  }
}

/**
 * Initialize affiliate for user
 * Call this when a user first accesses the affiliates page
 */
export async function initializeAffiliate(userId: string): Promise<string | null> {
  try {
    // Check if affiliate already exists
    const { data: existing } = await supabase
      .from('affiliates')
      .select('referral_code')
      .eq('user_id', userId)
      .single()

    if (existing) {
      return existing.referral_code
    }

    // Create new affiliate record
    const referralCode = 'REF' + Math.random().toString(36).substring(2, 10).toUpperCase()
    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_id: userId,
        referral_code: referralCode,
      })
      .select('referral_code')
      .single()

    if (error) {
      console.error('Error creating affiliate:', error)
      return null
    }

    return data.referral_code
  } catch (error) {
    console.error('Error initializing affiliate:', error)
    return null
  }
}

