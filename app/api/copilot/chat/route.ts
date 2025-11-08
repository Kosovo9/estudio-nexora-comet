import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { message, history, language, userId: clientUserId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    const currentUserId = userId || clientUserId

    // Pre-trained responses (can be expanded with AI)
    const responses: Record<string, Record<string, string>> = {
      en: {
        'how do i upload photos': 'To upload photos, click the "Upload Photos" button and select at least 3 images from your device. Supported formats: JPG, PNG.',
        'what styles are available': 'We offer two AI styles: Dark Studio (professional dark lighting) and Paris Café (warm, cozy atmosphere).',
        'how long does generation take': 'AI generation typically takes 12-20 seconds. You\'ll see a progress bar and timer during the process.',
        'how do i download my photo': 'After payment, you can download your photo without watermark. Downloads are available for 24 hours.',
        'what payment methods do you accept': 'We accept credit cards via Stripe and bank transfers (Mexico).',
        'default': 'I\'m here to help! You can ask me about photo upload, styles, generation time, downloads, or payments. How can I assist you?',
      },
      es: {
        'cómo subo fotos': 'Para subir fotos, haz clic en "Subir Fotos" y selecciona al menos 3 imágenes. Formatos soportados: JPG, PNG.',
        'qué estilos hay disponibles': 'Ofrecemos dos estilos AI: Dark Studio (iluminación oscura profesional) y Paris Café (atmósfera cálida y acogedora).',
        'cuánto tarda la generación': 'La generación AI normalmente toma 12-20 segundos. Verás una barra de progreso y temporizador durante el proceso.',
        'cómo descargo mi foto': 'Después del pago, puedes descargar tu foto sin marca de agua. Las descargas están disponibles por 24 horas.',
        'qué métodos de pago aceptan': 'Aceptamos tarjetas de crédito vía Stripe y transferencias bancarias (México).',
        'default': '¡Estoy aquí para ayudar! Puedes preguntarme sobre subir fotos, estilos, tiempo de generación, descargas o pagos. ¿En qué te puedo ayudar?',
      },
    }

    // Simple keyword matching (in production, use AI like DeepSeek/Qwen3)
    const langResponses = responses[language || 'en'] || responses.en
    const lowerMessage = message.toLowerCase()

    let response = langResponses.default

    for (const [key, value] of Object.entries(langResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        response = value
        break
      }
    }

    // TODO: Integrate with AI (DeepSeek/Qwen3/OpenAI)
    // const aiResponse = await fetchAIResponse(message, history, language)
    // response = aiResponse || response

    // Save to history
    if (currentUserId) {
      try {
        const { error } = await supabase.from('copilot_history').insert({
          user_id: currentUserId,
          message,
          response,
          language: language || 'en',
          created_at: new Date().toISOString(),
        })
        if (error) {
          console.error('Error saving to copilot_history:', error)
        }
      } catch (err) {
        console.error('Error saving to copilot_history:', err)
      }
    }

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('Copilot chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

