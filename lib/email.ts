// Email Marketing & Conversion Automation
// Supports multiple email providers (SendGrid, Resend, AWS SES, etc.)

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  cc?: string[]
  bcc?: string[]
  attachments?: Array<{
    filename: string
    content: string | Buffer
    type?: string
  }>
}

export interface ConversionEmailData {
  to: string
  userName?: string
  eventType: 'registration' | 'photo_ready' | 'payment_completed' | 'affiliate_earned' | 'recommendation'
  metadata?: Record<string, any>
}

/**
 * Send email via API route (server-side)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Email API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Send conversion email (automated)
 */
export async function sendConversionEmail(data: ConversionEmailData): Promise<boolean> {
  const templates = {
    registration: {
      subject: 'Welcome to Studio Nexora Comet! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Welcome ${data.userName || 'there'}!</h1>
          <p>Thank you for joining Studio Nexora Comet. You're now ready to transform your photos with AI-powered studio styles.</p>
          <a href="https://studio-nexora.com" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Get Started
          </a>
        </div>
      `,
    },
    photo_ready: {
      subject: 'Your AI Photo is Ready! ✨',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Your Photo is Ready!</h1>
          <p>Great news! Your AI-generated photo is ready for download.</p>
          <p><strong>Important:</strong> Your download link is available for 24 hours.</p>
          <a href="https://studio-nexora.com" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Download Now
          </a>
        </div>
      `,
    },
    payment_completed: {
      subject: 'Payment Confirmed - Download Your Photo! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Payment Confirmed!</h1>
          <p>Thank you for your purchase. Your payment has been confirmed.</p>
          <p>You can now download your photo without watermark.</p>
          <a href="https://studio-nexora.com" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Download Photo
          </a>
        </div>
      `,
    },
    affiliate_earned: {
      subject: 'You Earned a Commission! 💰',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #f59e0b;">Commission Earned!</h1>
          <p>Congratulations! You've earned a commission from your referral.</p>
          <p><strong>Amount:</strong> ${data.metadata?.amount || 'N/A'}</p>
          <p><strong>From:</strong> ${data.metadata?.referralEmail || 'N/A'}</p>
          <a href="https://studio-nexora.com/affiliates" style="display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View Dashboard
          </a>
        </div>
      `,
    },
    recommendation: {
      subject: 'Recommendation: Try Studio Nexora Comet! 🎨',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">Transform Your Photos with AI</h1>
          <p>${data.userName || 'A friend'} recommended Studio Nexora Comet to you!</p>
          <p>Create stunning AI-powered photo transformations in seconds.</p>
          <a href="https://studio-nexora.com${data.metadata?.ref ? `?ref=${data.metadata.ref}` : ''}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Get Started
          </a>
        </div>
      `,
    },
  }

  const template = templates[data.eventType]
  if (!template) {
    console.error(`Unknown email template: ${data.eventType}`)
    return false
  }

  return await sendEmail({
    to: data.to,
    subject: template.subject,
    html: template.html,
    from: process.env.EMAIL_FROM || 'noreply@studio-nexora.com',
  })
}

/**
 * Send bulk emails (for campaigns)
 */
export async function sendBulkEmails(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  for (const recipient of recipients) {
    const result = await sendEmail({ to: recipient, subject, html })
    if (result) {
      success++
    } else {
      failed++
    }
    // Rate limiting: wait 100ms between emails
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return { success, failed }
}

