import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Email provider configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend' // resend, sendgrid, aws_ses

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    // Optional: Require auth for sending emails (or allow public with rate limiting)
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { to, subject, html, text, from, replyTo, cc, bcc, attachments } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    let result: { success: boolean; messageId?: string; error?: string }

    switch (EMAIL_PROVIDER) {
      case 'resend':
        result = await sendViaResend({ to, subject, html, text, from, replyTo, cc, bcc, attachments })
        break
      case 'sendgrid':
        result = await sendViaSendGrid({ to, subject, html, text, from, replyTo, cc, bcc, attachments })
        break
      case 'aws_ses':
        result = await sendViaAWSSES({ to, subject, html, text, from, replyTo, cc, bcc, attachments })
        break
      default:
        return NextResponse.json(
          { error: `Unknown email provider: ${EMAIL_PROVIDER}` },
          { status: 400 }
        )
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Resend integration
async function sendViaResend(options: any) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || process.env.EMAIL_FROM || 'noreply@studio-nexora.com',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.message || 'Resend API error' }
    }

    return { success: true, messageId: data.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// SendGrid integration
async function sendViaSendGrid(options: any) {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    return { success: false, error: 'SENDGRID_API_KEY not configured' }
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: options.from || process.env.EMAIL_FROM || 'noreply@studio-nexora.com' },
        personalizations: [
          {
            to: Array.isArray(options.to) ? options.to.map((email: string) => ({ email })) : [{ email: options.to }],
            subject: options.subject,
            cc: options.cc?.map((email: string) => ({ email })),
            bcc: options.bcc?.map((email: string) => ({ email })),
          },
        ],
        content: [
          { type: 'text/html', value: options.html },
          ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
        ],
        attachments: options.attachments?.map((att: any) => ({
          content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
          filename: att.filename,
          type: att.type || 'application/octet-stream',
          disposition: 'attachment',
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: error || 'SendGrid API error' }
    }

    return { success: true, messageId: response.headers.get('x-message-id') || 'unknown' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// AWS SES integration
async function sendViaAWSSES(options: any) {
  // AWS SES requires AWS SDK
  // This is a placeholder - implement with @aws-sdk/client-ses
  return { success: false, error: 'AWS SES integration not yet implemented' }
}

