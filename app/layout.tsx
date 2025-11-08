import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import SentryInit from '@/components/SentryInit'
import AnalyticsAdvanced from '@/components/AnalyticsAdvanced'
import MegaUIWrapper from '@/components/MegaUIWrapper'
import SchemaOrg from '@/components/SchemaOrg'
import ChatAI247 from '@/components/ChatAI247'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI-Powered Photo Studio Global | Studio Nexora Comet',
  description: 'Global AI Photo Studio: edit, generate, market. Multilanguage support, 100% accessible + trusted worldwide.',
  keywords: 'ai photo, AI studio, imágenes, generator, edit, studio, AI, photo, marketplace, global, multilingual, internacional, international, affiliate, NFT, token, IA fotos',
  authors: [{ name: 'Studio Nexora Comet' }],
  creator: 'Studio Nexora Comet',
  publisher: 'Studio Nexora Comet',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://studio-nexora.com',
    siteName: 'Studio Nexora Comet',
    title: 'AI-Powered Photo Studio Global | Studio Nexora Comet',
    description: 'Create, edit and sell photos AI-generated anywhere. Now with multi-language and affiliate rewards.',
    images: [
      {
        url: 'https://studio-nexora.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Studio Nexora Comet - AI Photo Studio',
      },
    ],
    alternateLocale: ['es_MX', 'pt_BR', 'fr_FR', 'zh_CN'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Photo Studio Global',
    description: 'A global platform for AI-powered images, all devices, affiliate program, and marketplace.',
    images: ['https://studio-nexora.com/og-image.jpg'],
    creator: '@studio-nexora',
  },
  alternates: {
    canonical: 'https://studio-nexora.com',
    languages: {
      'x-default': 'https://studio-nexora.com',
      'en-US': 'https://studio-nexora.com/en',
      'es-MX': 'https://studio-nexora.com/es',
      'pt-BR': 'https://studio-nexora.com/pt',
      'fr-FR': 'https://studio-nexora.com/fr',
      'zh-CN': 'https://studio-nexora.com/zh',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
  },
}

// Google Analytics Component
function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
  
  return (
    <>
      {/* Google Analytics */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <GoogleAnalytics />
        </head>
        <body className={inter.className}>
          <SchemaOrg />
          <SentryInit />
          <AnalyticsAdvanced />
          {children}
          <MegaUIWrapper />
          <ChatAI247 lang="en" />
          {/* Support Chat Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <span>Need help? </span>
                <a
                  href="/admin/chat"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Chat Support
                </a>
                {' | '}
                <a
                  href="mailto:support@studio-nexora.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Email Support
                </a>
              </div>
              <div className="text-xs text-gray-500">
                Studio Nexora Comet © 2024
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}

