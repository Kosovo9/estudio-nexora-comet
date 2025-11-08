import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import SentryInit from '@/components/SentryInit'
import AnalyticsAdvanced from '@/components/AnalyticsAdvanced'
import MegaUIWrapper from '@/components/MegaUIWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Studio Nexora Comet - AI Photo Studio',
  description: 'Transform your photos with AI-powered studio styles',
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
          <SentryInit />
          <AnalyticsAdvanced />
          {children}
          <MegaUIWrapper />
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

