// Script auxiliar para obtener token de Google Search Console
// Ejecutar: node scripts/google-search-console-auth.js <CODIGO_DE_AUTORIZACION>

const { google } = require('googleapis')
const fs = require('fs')
const readline = require('readline')

const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || './google-credentials.json'
const TOKEN_PATH = process.env.GOOGLE_TOKEN_PATH || './google-token.json'
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']

const code = process.argv[2]

if (!code) {
  console.error('❌ Código de autorización requerido')
  console.log('')
  console.log('Uso: node scripts/google-search-console-auth.js <CODIGO>')
  console.log('')
  console.log('Para obtener el código:')
  console.log('   1. Ejecuta: node scripts/google-search-console.js')
  console.log('   2. Abre la URL que se muestra')
  console.log('   3. Autoriza la aplicación')
  console.log('   4. Copia el código de la URL')
  console.log('   5. Ejecuta este script con el código')
  process.exit(1)
}

async function getToken() {
  try {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('❌ Credenciales no encontradas en:', CREDENTIALS_PATH)
      process.exit(1)
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'))
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    const { tokens } = await oAuth2Client.getToken(code)
    oAuth2Client.setCredentials(tokens)

    // Guardar token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2))
    console.log('✅ Token guardado en:', TOKEN_PATH)
    console.log('')
    console.log('🎉 Autenticación completada!')
    console.log('   Ahora puedes ejecutar: node scripts/google-search-console.js')
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.message)
    process.exit(1)
  }
}

getToken()

