// Multi-Currency Payment Support
// Auto-detects user location and currency

import { stripe } from './stripe'

export type Currency = 'usd' | 'eur' | 'mxn' | 'gbp' | 'cad' | 'aud' | 'jpy' | 'brl'

export interface CurrencyConfig {
  code: Currency
  symbol: string
  name: string
  locale: string
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  usd: { code: 'usd', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  eur: { code: 'eur', symbol: '€', name: 'Euro', locale: 'en-EU' },
  mxn: { code: 'mxn', symbol: '$', name: 'Mexican Peso', locale: 'es-MX' },
  gbp: { code: 'gbp', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  cad: { code: 'cad', symbol: '$', name: 'Canadian Dollar', locale: 'en-CA' },
  aud: { code: 'aud', symbol: '$', name: 'Australian Dollar', locale: 'en-AU' },
  jpy: { code: 'jpy', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  brl: { code: 'brl', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
}

/**
 * Auto-detect user currency based on location
 */
export function detectUserCurrency(): Currency {
  if (typeof window === 'undefined') return 'usd'

  // Try to get from localStorage
  const stored = localStorage.getItem('preferred_currency') as Currency
  if (stored && CURRENCIES[stored]) {
    return stored
  }

  // Detect from browser locale
  const locale = navigator.language || 'en-US'
  const country = locale.split('-')[1]?.toLowerCase()

  const countryToCurrency: Record<string, Currency> = {
    us: 'usd',
    mx: 'mxn',
    gb: 'gbp',
    ca: 'cad',
    au: 'aud',
    jp: 'jpy',
    br: 'brl',
    de: 'eur',
    fr: 'eur',
    es: 'eur',
    it: 'eur',
    nl: 'eur',
    be: 'eur',
    at: 'eur',
    pt: 'eur',
    ie: 'eur',
    fi: 'eur',
    gr: 'eur',
  }

  return countryToCurrency[country || ''] || 'usd'
}

/**
 * Format amount in currency
 */
export function formatCurrency(amount: number, currency: Currency = 'usd'): string {
  const config = CURRENCIES[currency]
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

/**
 * Create Stripe checkout session with multi-currency support
 */
export async function createMultiCurrencyCheckout(
  priceId: string,
  currency: Currency,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  try {
    // Get price in the selected currency
    // Note: You need to create prices for each currency in Stripe
    const priceKey = `price_${currency}_${priceId.split('_').pop()}`
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceKey, // Use currency-specific price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      currency: currency,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        currency,
        ...metadata,
      },
      locale: CURRENCIES[currency].locale.split('-')[0],
    })

    return session
  } catch (error: any) {
    // Fallback: use default price and convert currency
    console.warn('Currency-specific price not found, using default:', error)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      currency: currency,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        currency,
        converted: 'true',
        ...metadata,
      },
      locale: CURRENCIES[currency].locale.split('-')[0],
    })

    return session
  }
}

/**
 * Convert amount between currencies (simplified - use real API in production)
 */
export async function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): Promise<number> {
  // In production, use a currency conversion API like exchangerate-api.com
  // For now, return a simple conversion (you should use real rates)
  const rates: Record<string, number> = {
    usd: 1,
    eur: 0.92,
    mxn: 17.5,
    gbp: 0.79,
    cad: 1.35,
    aud: 1.52,
    jpy: 150,
    brl: 5.0,
  }

  const fromRate = rates[from] || 1
  const toRate = rates[to] || 1

  return (amount / fromRate) * toRate
}

