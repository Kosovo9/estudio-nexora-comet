'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { Fingerprint, Eye } from 'lucide-react'

export default function BiometricLogin() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if biometric authentication is available
  const isBiometricAvailable = () => {
    if (typeof window === 'undefined') return false
    
    // Check for WebAuthn API (TouchID, FaceID, Windows Hello)
    return 'PublicKeyCredential' in window && 'credentials' in navigator
  }

  const handleBiometricLogin = async () => {
    if (!isLoaded || !isBiometricAvailable()) {
      setError('Biometric authentication not available on this device')
      return
    }

    setLoading(true)
    setError('')

    try {
      // WebAuthn API for biometric authentication
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32), // Should be generated server-side
          allowCredentials: [],
          timeout: 60000,
          userVerification: 'required', // Requires biometric
        },
      })

      if (credential) {
        // Send credential to server for verification
        const response = await fetch('/api/auth/biometric-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: {
              id: credential.id,
              type: credential.type,
              response: {
                authenticatorData: Array.from(
                  new Uint8Array((credential as any).response.authenticatorData)
                ),
                clientDataJSON: Array.from(
                  new Uint8Array((credential as any).response.clientDataJSON)
                ),
                signature: Array.from(
                  new Uint8Array((credential as any).response.signature)
                ),
              },
            },
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Complete sign-in with Clerk
          const result = await signIn.create({
            strategy: 'web3',
            identifier: data.userId,
          })

          if (result.status === 'complete') {
            await setActive({ session: result.createdSessionId })
            window.location.href = '/'
          }
        } else {
          setError('Biometric authentication failed')
        }
      }
    } catch (err: any) {
      console.error('Biometric login error:', err)
      setError(err.message || 'Biometric authentication failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isBiometricAvailable()) {
    return null // Don't show if not available
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleBiometricLogin}
        disabled={loading || !isLoaded}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <Fingerprint className="w-5 h-5" />
            <span>Login with Biometrics</span>
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Use TouchID, FaceID, or Windows Hello to sign in securely
      </p>
    </div>
  )
}

/**
 * Alternative: Clerk's built-in biometric support
 * Clerk automatically supports biometrics on compatible devices
 * Just use the standard SignIn component and it will show biometric option if available
 */
export function ClerkBiometricSignIn() {
  // Clerk handles biometrics automatically on iOS/Android
  // No additional code needed - just use <SignIn /> component
  return null
}

