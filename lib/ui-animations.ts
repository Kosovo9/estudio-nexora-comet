// UI Animations for Special Events
// Glow effects, celebrations, etc.

/**
 * Trigger Earth glow animation
 */
export function triggerEarthGlow(duration: number = 1400) {
  if (typeof window === 'undefined') return

  const earthCanvas = document.getElementById('earth-canvas')
  if (!earthCanvas) {
    // Try to find Three.js canvas
    const threeCanvas = document.querySelector('canvas')
    if (threeCanvas) {
      threeCanvas.style.filter = 'drop-shadow(0 0 40px #90caf9)'
      threeCanvas.style.transition = 'filter 0.3s ease'
      setTimeout(() => {
        threeCanvas.style.filter = ''
      }, duration)
    }
    return
  }

  earthCanvas.style.filter = 'drop-shadow(0 0 40px #90caf9)'
  earthCanvas.style.transition = 'filter 0.3s ease'
  setTimeout(() => {
    earthCanvas.style.filter = ''
  }, duration)
}

/**
 * Trigger celebration animation (confetti, etc.)
 */
export function triggerCelebration(type: 'success' | 'payment' | 'generation' = 'success') {
  if (typeof window === 'undefined') return

  // Simple celebration - puedes expandir con confetti library
  const colors = {
    success: '#10b981',
    payment: '#3b82f6',
    generation: '#8b5cf6',
  }

  const color = colors[type]

  // Create temporary glow effect
  document.body.style.transition = 'box-shadow 0.5s ease'
  document.body.style.boxShadow = `0 0 100px ${color}40`
  setTimeout(() => {
    document.body.style.boxShadow = ''
  }, 500)

  // Trigger Earth glow if available
  triggerEarthGlow(2000)
}

/**
 * Pulse animation for important elements
 */
export function pulseElement(elementId: string, duration: number = 2000) {
  if (typeof window === 'undefined') return

  const element = document.getElementById(elementId)
  if (!element) return

  element.style.animation = `pulse 1s ease-in-out ${duration / 1000}`
  setTimeout(() => {
    element.style.animation = ''
  }, duration)
}

// Add CSS animation if not exists
if (typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `
  if (!document.head.querySelector('style[data-pulse-animation]')) {
    style.setAttribute('data-pulse-animation', 'true')
    document.head.appendChild(style)
  }
}

