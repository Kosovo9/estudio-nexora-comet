// Sentry Error Tracking Setup
export function initSentry() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Dynamic import to avoid SSR issues
    import('@sentry/browser').then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
        beforeSend(event, hint) {
          // Filter out non-critical errors
          if (event.level === 'info') {
            return null
          }
          return event
        },
      })
    })
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    ;(window as any).Sentry.captureException(error, {
      extra: context,
    })
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    ;(window as any).Sentry.captureMessage(message, level)
  }
}

