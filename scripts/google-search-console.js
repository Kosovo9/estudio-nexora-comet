// Google Search Console API Integration
// Ejecutar: node scripts/google-search-console.js
// Requiere: npm install googleapis

const { google } = require('googleapis')
const fs = require('fs')
const path = require('path')

// Configuración
const SITE_URL = 'https://studio-nexora.com'
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json'
const TOKEN_PATH = process.env.GOOGLE_TOKEN_PATH || './google-token.json'

// Scopes necesarios
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']

async function authenticate() {
  try {
    // Cargar credenciales
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('❌ Credenciales no encontradas. Descarga el archivo JSON desde Google Cloud Console.')
      console.log('📝 Pasos:')
      console.log('   1. Ve a: https://console.cloud.google.com/')
      console.log('   2. Crea un proyecto o selecciona uno existente')
      console.log('   3. Habilita "Google Search Console API"')
      console.log('   4. Crea credenciales OAuth 2.0')
      console.log('   5. Descarga el JSON y guárdalo como: google-credentials.json')
      return null
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'))
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    // Verificar si ya tenemos token
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'))
      oAuth2Client.setCredentials(token)
      return oAuth2Client
    }

    // Obtener nuevo token
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })

    console.log('🔐 Autorización requerida:')
    console.log('   1. Abre esta URL:', authUrl)
    console.log('   2. Autoriza la aplicación')
    console.log('   3. Copia el código de autorización')
    console.log('')
    console.log('   Luego ejecuta: node scripts/google-search-console-auth.js <CODIGO>')

    return null
  } catch (error) {
    console.error('❌ Error en autenticación:', error)
    return null
  }
}

async function getSearchAnalytics(auth, startDate, endDate) {
  try {
    const searchConsole = google.searchconsole('v1')

    const response = await searchConsole.searchanalytics.query({
      auth,
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query', 'page', 'country', 'device'],
        rowLimit: 100,
      },
    })

    return response.data
  } catch (error) {
    console.error('❌ Error obteniendo analytics:', error.message)
    return null
  }
}

async function getSitemaps(auth) {
  try {
    const searchConsole = google.searchconsole('v1')

    const response = await searchConsole.sitemaps.list({
      auth,
      siteUrl: SITE_URL,
    })

    return response.data
  } catch (error) {
    console.error('❌ Error obteniendo sitemaps:', error.message)
    return null
  }
}

async function getIndexStatus(auth) {
  try {
    const searchConsole = google.searchconsole('v1')

    const response = await searchConsole.urlInspection.index.inspect({
      auth,
      requestBody: {
        inspectionUrl: SITE_URL,
        siteUrl: SITE_URL,
      },
    })

    return response.data
  } catch (error) {
    console.error('❌ Error obteniendo status de indexación:', error.message)
    return null
  }
}

async function main() {
  console.log('🔍 ==========================================')
  console.log('🔍 GOOGLE SEARCH CONSOLE API')
  console.log('🔍 ==========================================')
  console.log(`📊 Site: ${SITE_URL}`)
  console.log('')

  const auth = await authenticate()
  if (!auth) {
    return
  }

  // Fechas (últimos 30 días)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  console.log(`📅 Período: ${startDateStr} a ${endDateStr}`)
  console.log('')

  // Obtener Search Analytics
  console.log('📊 Obteniendo Search Analytics...')
  const analytics = await getSearchAnalytics(auth, startDateStr, endDateStr)
  if (analytics) {
    console.log(`✅ Total clicks: ${analytics.rows?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0}`)
    console.log(`✅ Total impressions: ${analytics.rows?.reduce((sum, row) => sum + (row.impressions || 0), 0) || 0}`)
    console.log(`✅ Total queries: ${analytics.rows?.length || 0}`)
    console.log('')

    // Top queries
    if (analytics.rows && analytics.rows.length > 0) {
      console.log('🔝 Top 10 Queries:')
      analytics.rows
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 10)
        .forEach((row, i) => {
          const query = row.keys?.[0] || 'N/A'
          console.log(`   ${i + 1}. "${query}" - Clicks: ${row.clicks || 0}, Impressions: ${row.impressions || 0}`)
        })
      console.log('')
    }
  }

  // Obtener Sitemaps
  console.log('🗺️  Obteniendo Sitemaps...')
  const sitemaps = await getSitemaps(auth)
  if (sitemaps && sitemaps.sitemap) {
    console.log(`✅ Sitemaps encontrados: ${sitemaps.sitemap.length}`)
    sitemaps.sitemap.forEach((sitemap) => {
      console.log(`   - ${sitemap.path} (${sitemap.type})`)
    })
    console.log('')
  }

  // Guardar resultados
  const resultsPath = path.join(process.cwd(), 'google-search-console-results.json')
  const results = {
    site: SITE_URL,
    period: { start: startDateStr, end: endDateStr },
    analytics,
    sitemaps,
    generatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2))
  console.log(`📝 Resultados guardados en: ${resultsPath}`)
  console.log('')
  console.log('✅ Proceso completado!')
}

// Ejecutar
main().catch(console.error)

