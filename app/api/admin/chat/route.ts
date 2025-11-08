import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, history } = await request.json()

    // TODO: Integrate with DeepSeek/Qwen3/OpenAI API
    // For now, return a simple response
    const response = await fetchChatbotResponse(message, history)

    // TODO: Save to Supabase for learning
    // await saveChatHistory(userId, message, response)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fetchChatbotResponse(
  message: string,
  history: any[]
): Promise<string> {
  // Simple rule-based responses (replace with AI API)
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! How can I help you with Studio Nexora Comet today?'
  }

  if (lowerMessage.includes('error') || lowerMessage.includes('problem')) {
    return 'I can help you troubleshoot. Can you describe the error you\'re experiencing?'
  }

  if (lowerMessage.includes('payment') || lowerMessage.includes('pago')) {
    return 'For payment issues, please check your payment method or contact support at support@studio-nexora.com'
  }

  if (lowerMessage.includes('download') || lowerMessage.includes('descargar')) {
    return 'Downloads are available for 24 hours after payment completion. If you need to download again, please contact support.'
  }

  // Default response
  return 'Thank you for your message. I\'m here to help with Studio Nexora Comet. Can you provide more details about what you need assistance with?'
}

