// Refresh Tokens & API Token Management
// Handles automatic token refresh for external APIs

export interface TokenData {
  token: string
  refreshToken?: string
  expiresAt?: number
  provider: 'stripe' | 'google_ai' | 'huggingface' | 'openai' | 'deepseek' | 'custom'
}

const tokenCache = new Map<string, TokenData>()

/**
 * Get or refresh API token
 */
export async function getAPIToken(provider: TokenData['provider']): Promise<string | null> {
  const cached = tokenCache.get(provider)
  
  // Check if token is still valid (with 5 minute buffer)
  if (cached && cached.expiresAt && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cached.token
  }

  // Refresh token
  const refreshed = await refreshAPIToken(provider, cached)
  if (refreshed) {
    tokenCache.set(provider, refreshed)
    return refreshed.token
  }

  return null
}

/**
 * Refresh API token
 */
export async function refreshAPIToken(
  provider: TokenData['provider'],
  currentToken?: TokenData
): Promise<TokenData | null> {
  try {
    switch (provider) {
      case 'stripe':
        // Stripe tokens don't expire, but we can validate
        const stripeKey = process.env.STRIPE_SECRET_KEY
        if (!stripeKey) {
          console.error('STRIPE_SECRET_KEY not configured')
          return null
        }
        return {
          token: stripeKey,
          provider: 'stripe',
          expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
        }

      case 'google_ai':
        // Google AI tokens are API keys, don't expire
        const googleKey = process.env.GOOGLE_AI_API_KEY
        if (!googleKey) {
          console.error('GOOGLE_AI_API_KEY not configured')
          return null
        }
        return {
          token: googleKey,
          provider: 'google_ai',
          expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }

      case 'huggingface':
        // Hugging Face tokens can be refreshed
        const hfToken = process.env.HUGGINGFACE_API_TOKEN
        if (!hfToken) {
          console.error('HUGGINGFACE_API_TOKEN not configured')
          return null
        }
        // Validate token by making a test request
        try {
          const response = await fetch('https://api-inference.huggingface.co/models', {
            headers: {
              'Authorization': `Bearer ${hfToken}`,
            },
          })
          if (response.ok) {
            return {
              token: hfToken,
              provider: 'huggingface',
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
            }
          }
        } catch (error) {
          console.error('Hugging Face token validation failed:', error)
        }
        return null

      case 'openai':
        // OpenAI tokens are API keys, don't expire
        const openaiKey = process.env.OPENAI_API_KEY
        if (!openaiKey) {
          console.error('OPENAI_API_KEY not configured')
          return null
        }
        return {
          token: openaiKey,
          provider: 'openai',
          expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }

      case 'deepseek':
        // DeepSeek tokens are API keys
        const deepseekKey = process.env.DEEPSEEK_API_KEY
        if (!deepseekKey) {
          console.error('DEEPSEEK_API_KEY not configured')
          return null
        }
        return {
          token: deepseekKey,
          provider: 'deepseek',
          expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }

      case 'custom':
        // Custom provider - use refresh endpoint if available
        if (currentToken?.refreshToken) {
          const refreshUrl = process.env.CUSTOM_TOKEN_REFRESH_URL
          if (!refreshUrl) {
            console.error('CUSTOM_TOKEN_REFRESH_URL not configured')
            return null
          }

          const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: currentToken.refreshToken,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            return {
              token: data.newToken || data.token,
              refreshToken: data.refreshToken || currentToken.refreshToken,
              expiresAt: data.expiresAt || Date.now() + 60 * 60 * 1000, // Default 1 hour
              provider: provider, // Required by TokenData interface
            }
          }
        }
        return null

      default:
        console.error(`Unknown provider: ${provider}`)
        return null
    }
  } catch (error) {
    console.error(`Error refreshing ${provider} token:`, error)
    return null
  }
}

/**
 * Clear token cache (useful for testing or forced refresh)
 */
export function clearTokenCache(provider?: TokenData['provider']): void {
  if (provider) {
    tokenCache.delete(provider)
  } else {
    tokenCache.clear()
  }
}

/**
 * Set token manually (for testing or custom scenarios)
 */
export function setToken(provider: TokenData['provider'], tokenData: TokenData): void {
  tokenCache.set(provider, tokenData)
}

/**
 * Background token refresh (call this periodically)
 */
export async function refreshAllTokens(): Promise<void> {
  const providers: TokenData['provider'][] = [
    'stripe',
    'google_ai',
    'huggingface',
    'openai',
    'deepseek',
  ]

  for (const provider of providers) {
    try {
      await refreshAPIToken(provider)
    } catch (error) {
      console.error(`Failed to refresh ${provider} token:`, error)
    }
  }
}

// Auto-refresh tokens every hour (in server environment)
if (typeof window === 'undefined') {
  setInterval(() => {
    refreshAllTokens().catch(console.error)
  }, 60 * 60 * 1000) // 1 hour
}

