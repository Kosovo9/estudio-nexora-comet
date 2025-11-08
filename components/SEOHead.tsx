'use client'

import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  desc?: string
  keywords?: string
  image?: string
  url?: string
  lang?: 'en' | 'es' | 'pt' | 'fr' | 'zh'
}

export default function SEOHead({
  title = 'AI-Powered Photo Studio Global | Studio Nexora Comet',
  desc = 'Global AI Photo Studio: edit, generate, market. Multilanguage support, 100% accessible + trusted worldwide.',
  keywords = 'ai photo, AI studio, imágenes, generator, edit, studio, AI, photo, marketplace, global, multilingual, internacional, international, affiliate, NFT, token, IA fotos',
  image = 'https://studio-nexora.com/og-image.jpg',
  url = 'https://studio-nexora.com',
  lang = 'en',
}: SEOHeadProps) {
  const hrefLangMap = {
    en: 'en-US',
    es: 'es-MX',
    pt: 'pt-BR',
    fr: 'fr-FR',
    zh: 'zh-CN',
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Studio Nexora Comet" />
      <meta name="language" content={lang} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Studio Nexora Comet" />
      <meta property="og:locale" content={hrefLangMap[lang]} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@studio-nexora" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Idioma y mercado global */}
      <link rel="alternate" hrefLang="x-default" href="https://studio-nexora.com" />
      <link rel="alternate" hrefLang="en-US" href="https://studio-nexora.com/en" />
      <link rel="alternate" hrefLang="es-MX" href="https://studio-nexora.com/es" />
      <link rel="alternate" hrefLang="pt-BR" href="https://studio-nexora.com/pt" />
      <link rel="alternate" hrefLang="fr-FR" href="https://studio-nexora.com/fr" />
      <link rel="alternate" hrefLang="zh-CN" href="https://studio-nexora.com/zh" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  )
}

