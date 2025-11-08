// Logs automáticos de interacción para analytics/admin

export interface LogEvent {
  event: string
  data?: Record<string, any>
  timestamp?: string
  userId?: string
  sessionId?: string
}

/**
 * Log user event to analytics/admin dashboard
 */
export async function logUserEvent(
  event: string,
  data: Record<string, any> = {}
): Promise<void> {
  try {
    // Get user ID if available (Clerk)
    const userId =
      typeof window !== 'undefined' && (window as any).Clerk?.user?.id
        ? (window as any).Clerk.user.id
        : undefined

    // Get or create session ID
    let sessionId = ''
    if (typeof window !== 'undefined') {
      sessionId = sessionStorage.getItem('nexora_session_id') || ''
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('nexora_session_id', sessionId)
      }
    }

    const logData: LogEvent = {
      event,
      data,
      timestamp: new Date().toISOString(),
      userId,
      sessionId,
    }

    // Send to API
    await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    })

    // Also track in Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', event, {
        ...data,
        userId,
        sessionId,
      })
    }
  } catch (error) {
    console.error('Error logging user event:', error)
    // Don't throw - logging should not break the app
  }
}

/**
 * Log page view
 */
export function logPageView(path: string, title?: string): void {
  logUserEvent('page_view', {
    path,
    title: title || document.title,
  })
}

/**
 * Log button click
 */
export function logButtonClick(buttonName: string, context?: Record<string, any>): void {
  logUserEvent('button_click', {
    button: buttonName,
    ...context,
  })
}

/**
 * Log form submission
 */
export function logFormSubmit(formName: string, data?: Record<string, any>): void {
  logUserEvent('form_submit', {
    form: formName,
    ...data,
  })
}

/**
 * Log file upload
 */
export function logFileUpload(fileCount: number, fileTypes?: string[]): void {
  logUserEvent('file_upload', {
    fileCount,
    fileTypes,
  })
}

/**
 * Log step progression
 */
export function logStepProgress(step: number, stepName: string): void {
  logUserEvent('step_progress', {
    step,
    stepName,
  })
}

