// SEO Keywords Audit Script
// Ejecutar: node scripts/seo-keywords-audit.js
// Requiere: npm install axios cheerio

const axios = require('axios')
const cheerio = require('cheerio')

const urls = [
  'https://studio-nexora.com/', // Base
  'https://studio-nexora.com/en', // English
  'https://studio-nexora.com/es', // Español
  // Agregar más URLs según sea necesario
]

async function auditKeywords(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    const $ = cheerio.load(data)
    const title = $('title').text()
    const desc = $('meta[name="description"]').attr('content') || ''
    const kw = $('meta[name="keywords"]').attr('content') || ''
    const h1 = $('h1').first().text()
    const h2Count = $('h2').length
    const h3Count = $('h3').length
    const outboundLinks = $('a[href^="http"]').length
    const internalLinks = $('a[href^="/"]').length
    const images = $('img').length
    const imagesWithAlt = $('img[alt]').length
    const schemaCount = $('script[type="application/ld+json"]').length
    const wordCount = $('body').text().split(/\s+/).filter((w) => w.length > 0).length

    console.log(`\n📊 [${url}]`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📝 Title: ${title}`)
    console.log(`📄 Description: ${desc.substring(0, 120)}${desc.length > 120 ? '...' : ''}`)
    console.log(`🔑 Keywords: ${kw.replace(/,/g, ', ')}`)
    console.log(`#️⃣  H1: ${h1}`)
    console.log(`📊 H2 count: ${h2Count}`)
    console.log(`📊 H3 count: ${h3Count}`)
    console.log(`🔗 Outbound links: ${outboundLinks}`)
    console.log(`🔗 Internal links: ${internalLinks}`)
    console.log(`🖼️  Images: ${images} (${imagesWithAlt} with alt tags)`)
    console.log(`📋 Schema.org: ${schemaCount > 0 ? '✅ Sí' : '❌ No'}`)
    console.log(`📝 Word count: ${wordCount}`)

    // Análisis de keywords
    const keywords = kw.split(',').map((k) => k.trim()).filter((k) => k)
    console.log(`🔑 Keywords encontradas: ${keywords.length}`)
    if (keywords.length > 0) {
      console.log(`   ${keywords.join(', ')}`)
    }

    // Verificar Open Graph
    const ogTitle = $('meta[property="og:title"]').attr('content')
    const ogDesc = $('meta[property="og:description"]').attr('content')
    const ogImage = $('meta[property="og:image"]').attr('content')
    console.log(`📱 Open Graph: ${ogTitle ? '✅' : '❌'}`)
    if (ogTitle) {
      console.log(`   Title: ${ogTitle.substring(0, 60)}...`)
    }

    // Verificar Twitter Card
    const twitterCard = $('meta[name="twitter:card"]').attr('content')
    console.log(`🐦 Twitter Card: ${twitterCard ? '✅' : '❌'}`)

    // Verificar Canonical
    const canonical = $('link[rel="canonical"]').attr('href')
    console.log(`🔗 Canonical: ${canonical || '❌ No encontrado'}`)

    // Verificar Hreflang
    const hreflang = $('link[rel="alternate"][hreflang]').length
    console.log(`🌐 Hreflang: ${hreflang} alternativas`)

    return {
      url,
      title,
      description: desc,
      keywords: keywords,
      h1,
      h2Count,
      h3Count,
      outboundLinks,
      internalLinks,
      images,
      imagesWithAlt,
      schemaCount,
      wordCount,
      ogTitle,
      ogDesc,
      ogImage,
      twitterCard,
      canonical,
      hreflang,
    }
  } catch (error) {
    console.error(`❌ Error analizando ${url}:`, error.message)
    return null
  }
}

;(async () => {
  console.log('🔍 ==========================================')
  console.log('🔍 SEO KEYWORDS AUDIT - Studio Nexora Comet')
  console.log('🔍 ==========================================')
  console.log('')

  const results = []

  for (const url of urls) {
    const result = await auditKeywords(url)
    if (result) {
      results.push(result)
    }
    // Pequeña pausa entre requests
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('\n')
  console.log('📊 ==========================================')
  console.log('📊 RESUMEN GENERAL')
  console.log('📊 ==========================================')
  console.log('')

  if (results.length > 0) {
    const avgWordCount = Math.round(
      results.reduce((sum, r) => sum + r.wordCount, 0) / results.length
    )
    const totalImages = results.reduce((sum, r) => sum + r.images, 0)
    const totalImagesWithAlt = results.reduce((sum, r) => sum + r.imagesWithAlt, 0)
    const totalSchema = results.reduce((sum, r) => sum + r.schemaCount, 0)

    console.log(`📄 Páginas analizadas: ${results.length}`)
    console.log(`📝 Promedio palabras: ${avgWordCount}`)
    console.log(`🖼️  Total imágenes: ${totalImages} (${totalImagesWithAlt} con alt)`)
    console.log(`📋 Schema.org encontrados: ${totalSchema}`)
    console.log(`✅ Páginas con Open Graph: ${results.filter((r) => r.ogTitle).length}/${results.length}`)
    console.log(`✅ Páginas con Twitter Card: ${results.filter((r) => r.twitterCard).length}/${results.length}`)
    console.log(`✅ Páginas con Canonical: ${results.filter((r) => r.canonical).length}/${results.length}`)
  }

  console.log('\n✅ Análisis completado!')
  console.log('')
  console.log('💡 Sugerencias:')
  console.log('   - Verifica que todas las imágenes tengan alt tags')
  console.log('   - Asegúrate de tener Schema.org en todas las páginas')
  console.log('   - Optimiza títulos y descripciones para keywords')
  console.log('   - Aumenta contenido relevante (más palabras)')
  console.log('')
})()

