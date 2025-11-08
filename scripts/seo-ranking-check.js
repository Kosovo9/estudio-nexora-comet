// SEO Ranking Check Script - Verifica posicionamiento en Google
// Ejecutar: node scripts/seo-ranking-check.js
// Requiere: npm install axios cheerio

const axios = require('axios')
const cheerio = require('cheerio')

// Lista palabras clave y país (puedes agregar más)
const queries = [
  { q: 'ai photo studio', country: 'us', lang: 'en' },
  { q: 'estudio fotos ia', country: 'mx', lang: 'es' },
  { q: 'generador imagen ai', country: 'es', lang: 'es' },
  { q: 'ai image generator', country: 'us', lang: 'en' },
  { q: 'photo editor ai', country: 'us', lang: 'en' },
  { q: 'editor fotos inteligencia artificial', country: 'mx', lang: 'es' },
  { q: 'marketplace fotos ai', country: 'es', lang: 'es' },
  { q: 'ai photo marketplace', country: 'us', lang: 'en' },
]

const TARGET_DOMAIN = 'studio-nexora.com'
const MAX_RESULTS = 50 // Máximo de resultados a revisar

async function checkGoogle(queryString, country, lang) {
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(queryString)}&hl=${lang}&gl=${country}&num=50`
    
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': `${lang}-${country.toUpperCase()},${lang};q=0.9`,
      },
      timeout: 10000,
    })

    const $ = cheerio.load(data)
    let found = false
    let rank = 0
    let foundUrl = ''

    // Buscar en resultados orgánicos
    $('div.g').each((index, el) => {
      const link = $(el).find('a').attr('href')
      if (link && link.includes(TARGET_DOMAIN)) {
        found = true
        rank = index + 1
        foundUrl = link
        return false // Break loop
      }
    })

    if (found) {
      console.log(
        `✅ [SEO ${country.toUpperCase()}] "${queryString}" → Rank: #${rank} - ${foundUrl}`
      )
      return { query: queryString, country, rank, url: foundUrl, found: true }
    } else {
      console.log(`❌ [SEO ${country.toUpperCase()}] "${queryString}" → NO rankeado aún (top ${MAX_RESULTS})`)
      return { query: queryString, country, rank: null, url: null, found: false }
    }
  } catch (error) {
    console.error(`❌ Error checking "${queryString}" (${country}):`, error.message)
    return { query: queryString, country, rank: null, url: null, found: false, error: error.message }
  }
}

;(async () => {
  console.log('🔍 ==========================================')
  console.log('🔍 SEO RANKING CHECK - Studio Nexora Comet')
  console.log('🔍 ==========================================')
  console.log(`🎯 Target Domain: ${TARGET_DOMAIN}`)
  console.log('')

  const results = []

  for (const query of queries) {
    const result = await checkGoogle(query.q, query.country, query.lang)
    results.push(result)
    
    // Pausa entre requests para evitar rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  console.log('')
  console.log('📊 ==========================================')
  console.log('📊 RESUMEN DE RANKING')
  console.log('📊 ==========================================')
  console.log('')

  const found = results.filter((r) => r.found)
  const notFound = results.filter((r) => !r.found)

  console.log(`✅ Rankeados: ${found.length}/${results.length}`)
  if (found.length > 0) {
    console.log('')
    console.log('Top Rankings:')
    found
      .sort((a, b) => (a.rank || 0) - (b.rank || 0))
      .forEach((r) => {
        console.log(`   #${r.rank} - "${r.query}" (${r.country.toUpperCase()})`)
      })
  }

  if (notFound.length > 0) {
    console.log('')
    console.log(`❌ No rankeados: ${notFound.length}`)
    notFound.forEach((r) => {
      console.log(`   - "${r.query}" (${r.country.toUpperCase()})`)
    })
  }

  console.log('')
  console.log('💡 Sugerencias:')
  console.log('   - Optimiza contenido para keywords no rankeadas')
  console.log('   - Crea backlinks desde sitios relevantes')
  console.log('   - Mejora SEO técnico (velocidad, mobile, etc.)')
  console.log('   - Publica contenido regularmente')
  console.log('')

  // Guardar resultados en archivo
  const fs = require('fs')
  const resultsPath = './seo-ranking-results.json'
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
  console.log(`📝 Resultados guardados en: ${resultsPath}`)
  console.log('')
})()

