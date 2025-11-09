'use client'

import { useState, useRef, useEffect } from 'react'
import { type Language } from '@/lib/i18n'
import { Send, X, Minimize2, Maximize2, Bot } from 'lucide-react'

interface ChatAI247Props {
  lang?: Language
}

interface Message {
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function ChatAI247({ lang = 'es' }: ChatAI247Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Llamar a la API de Copilot (que ya tenemos implementada)
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          lang,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiMessage: Message = {
        role: 'ai',
        content: data.response || data.message || (lang === 'es' ? 'Sin respuesta.' : 'No response.'),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'ai',
        content: lang === 'es' ? 'Error al enviar mensaje. Intenta de nuevo.' : 'Error sending message. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const t = {
    title: lang === 'es' ? 'Chat AI 24/7' : 'AI Chat 24/7',
    placeholder: lang === 'es' ? 'Pregunta aquí...' : 'Ask here...',
    send: lang === 'es' ? 'Enviar' : 'Send',
    you: lang === 'es' ? 'Tú' : 'You',
    ai: 'AI',
    close: lang === 'es' ? 'Cerrar' : 'Close',
    minimize: lang === 'es' ? 'Minimizar' : 'Minimize',
    maximize: lang === 'es' ? 'Maximizar' : 'Maximize',
    welcome: lang === 'es' 
      ? '¡Hola! Soy tu asistente AI. ¿En qué puedo ayudarte?'
      : 'Hello! I am your AI assistant. How can I help you?',
  }

  if (!isOpen && !isMinimized) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-20 z-[20000] bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110"
        aria-label={t.title}
      >
        <Bot className="w-6 h-6" />
      </button>
    )
  }

  if (isMinimized) {
    return (
      <div className="fixed right-4 bottom-20 z-[20000] bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between p-3">
          <span className="text-sm font-semibold text-blue-300">{t.title}</span>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed right-4 bottom-20 z-[20000] w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col"
      style={{ height: isMinimized ? 'auto' : '500px' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-white" />
          <span className="font-semibold text-white">{t.title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsMinimized(true)
              setIsOpen(false)
            }}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label={t.minimize}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900/50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            {t.welcome}
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200'
              }`}
            >
              <div className="text-xs font-semibold mb-1 opacity-80">
                {msg.role === 'user' ? t.you : t.ai}:
              </div>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg px-4 py-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{t.send}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

