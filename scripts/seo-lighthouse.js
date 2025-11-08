// Script para ejecutar Lighthouse SEO audit
// Ejecutar: node scripts/seo-lighthouse.js

const { exec } = require('child_process')
const path = require('path')
const os = require('os')

const url = process.argv[2] || 'https://studio-nexora.com'
const outputPath = path.join(process.cwd(), 'seo-report.html')

console.log('🔍 Ejecutando Lighthouse SEO audit...')
console.log(`📊 URL: ${url}`)
console.log(`📄 Reporte: ${outputPath}`)
console.log('')

const command = `npx lighthouse "${url}" --output html --output-path "${outputPath}" --chrome-flags="--headless" --only-categories=seo,accessibility,performance`

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error ejecutando Lighthouse:', error)
    return
  }

  console.log(stdout)

  if (stderr) {
    console.error('⚠️  Warnings:', stderr)
  }

  console.log('')
  console.log('✅ Reporte generado exitosamente!')
  console.log(`📂 Ubicación: ${outputPath}`)
  console.log('')

  // Abrir reporte automáticamente
  const platform = os.platform()
  let openCommand

  if (platform === 'darwin') {
    openCommand = `open "${outputPath}"`
  } else if (platform === 'linux') {
    openCommand = `xdg-open "${outputPath}"`
  } else if (platform === 'win32') {
    openCommand = `start "" "${outputPath}"`
  } else {
    console.log('⚠️  Plataforma no soportada para abrir automáticamente')
    return
  }

  exec(openCommand, (err) => {
    if (err) {
      console.log('⚠️  No se pudo abrir automáticamente. Abre manualmente:', outputPath)
    }
  })
})

