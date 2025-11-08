// SEO Campaigns Multilingual Automation
// Ejecutar: node scripts/seo-campaigns-multilang.js
// Requiere: npm install axios (opcional: nodemailer para emails)

const axios = require('axios')
const fs = require('fs')
const path = require('path')

// Configuración de campañas por idioma
const campaigns = {
  en: {
    email: {
      subject: 'AI Studio just got better 🌍',
      body: `
        <h1>Welcome to Studio Nexora Comet!</h1>
        <p>Edit, generate, and sell your photos with AI-powered tools.</p>
        <p>Features:</p>
        <ul>
          <li>AI Photo Generation</li>
          <li>Professional Editing</li>
          <li>Marketplace Integration</li>
          <li>Affiliate Program</li>
        </ul>
        <p><a href="https://studio-nexora.com/en">Visit Now</a></p>
      `,
      cta: 'Get Started',
    },
    social: {
      twitter: 'Check out Studio Nexora Comet - AI Photo Studio! Edit, generate, and sell photos with AI. https://studio-nexora.com/en',
      facebook: 'Studio Nexora Comet - Transform your photos with AI! https://studio-nexora.com/en',
      linkedin: 'Introducing Studio Nexora Comet - AI-powered photo studio with marketplace and affiliate program. https://studio-nexora.com/en',
    },
    ads: {
      google: {
        headline: 'AI Photo Studio - Edit & Generate',
        description: 'Transform your photos with AI. Professional tools, marketplace, affiliate program.',
        keywords: ['ai photo studio', 'photo editor ai', 'ai image generator'],
      },
      facebook: {
        title: 'AI Photo Studio',
        description: 'Edit, generate, and sell photos with AI',
        image: 'https://studio-nexora.com/og-image.jpg',
      },
    },
  },
  es: {
    email: {
      subject: '¡Studio AI ahora global 🌎!',
      body: `
        <h1>¡Bienvenido a Studio Nexora Comet!</h1>
        <p>Edita, genera y vende tus fotos con herramientas de IA.</p>
        <p>Características:</p>
        <ul>
          <li>Generación de Fotos con IA</li>
          <li>Edición Profesional</li>
          <li>Integración Marketplace</li>
          <li>Programa de Afiliados</li>
        </ul>
        <p><a href="https://studio-nexora.com/es">Visitar Ahora</a></p>
      `,
      cta: 'Comenzar',
    },
    social: {
      twitter: '¡Conoce Studio Nexora Comet - Estudio de Fotos con IA! Edita, genera y vende fotos con IA. https://studio-nexora.com/es',
      facebook: 'Studio Nexora Comet - Transforma tus fotos con IA! https://studio-nexora.com/es',
      linkedin: 'Presentamos Studio Nexora Comet - Estudio de fotos con IA, marketplace y programa de afiliados. https://studio-nexora.com/es',
    },
    ads: {
      google: {
        headline: 'Estudio de Fotos IA - Edita y Genera',
        description: 'Transforma tus fotos con IA. Herramientas profesionales, marketplace, programa de afiliados.',
        keywords: ['estudio fotos ia', 'editor fotos ia', 'generador imagen ai'],
      },
      facebook: {
        title: 'Estudio de Fotos IA',
        description: 'Edita, genera y vende fotos con IA',
        image: 'https://studio-nexora.com/og-image.jpg',
      },
    },
  },
  pt: {
    email: {
      subject: 'Estúdio de Fotos IA agora global 🌍!',
      body: `
        <h1>Bem-vindo ao Studio Nexora Comet!</h1>
        <p>Edite, gere e venda suas fotos com ferramentas de IA.</p>
        <p>Recursos:</p>
        <ul>
          <li>Geração de Fotos com IA</li>
          <li>Edição Profissional</li>
          <li>Integração Marketplace</li>
          <li>Programa de Afiliados</li>
        </ul>
        <p><a href="https://studio-nexora.com/pt">Visitar Agora</a></p>
      `,
      cta: 'Começar',
    },
    social: {
      twitter: 'Conheça o Studio Nexora Comet - Estúdio de Fotos com IA! Edite, gere e venda fotos com IA. https://studio-nexora.com/pt',
      facebook: 'Studio Nexora Comet - Transforme suas fotos com IA! https://studio-nexora.com/pt',
      linkedin: 'Apresentamos o Studio Nexora Comet - Estúdio de fotos com IA, marketplace e programa de afiliados. https://studio-nexora.com/pt',
    },
    ads: {
      google: {
        headline: 'Estúdio de Fotos IA - Edite e Gere',
        description: 'Transforme suas fotos com IA. Ferramentas profissionais, marketplace, programa de afiliados.',
        keywords: ['estudio fotos ia', 'editor fotos ia', 'gerador imagem ai'],
      },
      facebook: {
        title: 'Estúdio de Fotos IA',
        description: 'Edite, gere e venda fotos com IA',
        image: 'https://studio-nexora.com/og-image.jpg',
      },
    },
  },
}

// UTM Parameters para tracking
function generateUTM(source, medium, campaign, lang) {
  return `?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}&utm_lang=${lang}`
}

// Generar contenido de campaña
function generateCampaignContent(lang, type) {
  const campaign = campaigns[lang]
  if (!campaign) {
    console.warn(`⚠️  No campaign found for language: ${lang}`)
    return null
  }

  const baseUrl = `https://studio-nexora.com/${lang === 'en' ? '' : lang}`
  const utm = generateUTM('campaign', type, 'multilang', lang)

  return {
    lang,
    type,
    email: {
      ...campaign.email,
      url: `${baseUrl}${utm}`,
    },
    social: {
      ...campaign.social,
      url: `${baseUrl}${utm}`,
    },
    ads: {
      ...campaign.ads,
      url: `${baseUrl}${utm}`,
    },
  }
}

// Exportar contenido para diferentes plataformas
function exportCampaigns() {
  console.log('📧 ==========================================')
  console.log('📧 SEO CAMPAIGNS MULTILINGUAL')
  console.log('📧 ==========================================')
  console.log('')

  const allCampaigns = []
  const languages = Object.keys(campaigns)

  languages.forEach((lang) => {
    console.log(`🌐 Generando campañas para: ${lang.toUpperCase()}`)
    console.log('')

    const email = generateCampaignContent(lang, 'email')
    const social = generateCampaignContent(lang, 'social')
    const ads = generateCampaignContent(lang, 'ads')

    if (email) {
      allCampaigns.push(email)
      console.log('✅ Email Campaign:')
      console.log(`   Subject: ${email.email.subject}`)
      console.log(`   URL: ${email.email.url}`)
      console.log('')

      console.log('✅ Social Media:')
      console.log(`   Twitter: ${social.social.twitter.substring(0, 60)}...`)
      console.log(`   Facebook: ${social.social.facebook.substring(0, 60)}...`)
      console.log('')

      console.log('✅ Ads:')
      console.log(`   Google Headline: ${ads.ads.google.headline}`)
      console.log(`   Keywords: ${ads.ads.google.keywords.join(', ')}`)
      console.log('')
    }
  })

  // Guardar campañas
  const campaignsPath = path.join(process.cwd(), 'seo-campaigns.json')
  fs.writeFileSync(campaignsPath, JSON.stringify(allCampaigns, null, 2))
  console.log(`📝 Campañas guardadas en: ${campaignsPath}`)
  console.log('')

  // Generar reporte
  generateCampaignsReport(allCampaigns)

  return allCampaigns
}

function generateCampaignsReport(campaigns) {
  const reportPath = path.join(process.cwd(), 'seo-campaigns-report.html')
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Campaigns Report - Studio Nexora Comet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #fff; }
    h1 { color: #4CAF50; }
    .campaign { background: #2a2a2a; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .campaign h2 { color: #4CAF50; }
    .section { margin: 15px 0; }
    .section h3 { color: #ffa500; }
    pre { background: #1a1a1a; padding: 10px; border-radius: 4px; overflow-x: auto; }
    a { color: #4CAF50; }
  </style>
</head>
<body>
  <h1>📧 SEO Campaigns Multilingual Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  
  ${campaigns
    .map(
      (c) => `
  <div class="campaign">
    <h2>🌐 ${c.lang.toUpperCase()} - ${c.type.toUpperCase()}</h2>
    
    <div class="section">
      <h3>Email</h3>
      <p><strong>Subject:</strong> ${c.email.subject}</p>
      <p><strong>URL:</strong> <a href="${c.email.url}">${c.email.url}</a></p>
      <p><strong>CTA:</strong> ${c.email.cta}</p>
    </div>
    
    <div class="section">
      <h3>Social Media</h3>
      <p><strong>Twitter:</strong> ${c.social.twitter}</p>
      <p><strong>Facebook:</strong> ${c.social.facebook}</p>
      <p><strong>LinkedIn:</strong> ${c.social.linkedin}</p>
    </div>
    
    <div class="section">
      <h3>Ads</h3>
      <p><strong>Google Headline:</strong> ${c.ads.google.headline}</p>
      <p><strong>Description:</strong> ${c.ads.google.description}</p>
      <p><strong>Keywords:</strong> ${c.ads.google.keywords.join(', ')}</p>
    </div>
  </div>
  `
    )
    .join('')}
</body>
</html>`

  fs.writeFileSync(reportPath, html)
  console.log(`📄 Reporte HTML generado: ${reportPath}`)
}

// Ejecutar
exportCampaigns()

