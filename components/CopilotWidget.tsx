'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, X, Send, Lightbulb, History } from 'lucide-react'
import { getTexts, type Language } from '@/lib/i18n'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface CopilotWidgetProps {
  user?: {
    id?: string
    email?: string
    lang?: Language
  }
  floating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export default function CopilotWidget({
  user,
  floating = 'bottom-right',
}: CopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const language = user?.lang || 'en'
  const texts = getTexts(language)

  const positionMap = {
    'bottom-right': { right: 14, bottom: 16 },
    'bottom-left': { left: 14, bottom: 16 },
    'top-right': { right: 14, top: 16 },
    'top-left': { left: 14, top: 16 },
  }

  const copilotTexts = {
    en: {
      title: 'Nexora Copilot',
      placeholder: 'How can I help you?',
      send: 'Send',
      suggestions: 'Suggestions',
      history: 'History',
      tips: [
        'How do I upload photos?',
        'What styles are available?',
        'How long does generation take?',
        'How do I download my photo?',
        'What payment methods do you accept?',
      ],
    },
    es: {
      title: 'Asistente Nexora',
      placeholder: '¿En qué te ayudo?',
      send: 'Enviar',
      suggestions: 'Sugerencias',
      history: 'Historial',
      tips: [
        '¿Cómo subo fotos?',
        '¿Qué estilos hay disponibles?',
        '¿Cuánto tarda la generación?',
        '¿Cómo descargo mi foto?',
        '¿Qué métodos de pago aceptan?',
      ],
    },
  }

  const t = copilotTexts[language]

  useEffect(() => {
    // Load chat history
    loadHistory()
    // Load suggestions
    loadSuggestions()
  }, [])

  useEffect(() => {
    // Scroll to bottom when new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/copilot/history')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const loadSuggestions = () => {
    setSuggestions(t.tips)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages,
          language,
          userId: user?.id,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Copilot error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'es' 
          ? 'Lo siento, hubo un error. Por favor intenta de nuevo.'
          : 'Sorry, there was an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
          style={{
            ...positionMap[floating],
            borderRadius: '20px 12px 20px 20px',
          }}
          aria-label={t.title}
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Widget Panel */}
      {isOpen && (
        <div
          className="fixed w-96 h-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50"
          style={{
            ...positionMap[floating],
            borderRadius: '20px 12px 20px 20px',
            background: '#28415e',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">{t.title}</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">{t.suggestions}:</p>
                <div className="space-y-2">
                  {suggestions.map((tip, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(tip)}
                      className="w-full text-left px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm text-gray-300 flex items-start space-x-2"
                    >
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

