// SEO Backlinks Automation Script
// Ejecutar: node scripts/seo-backlinks.js
// Requiere: npm install axios

const axios = require('axios')
const fs = require('fs')
const path = require('path')

const TARGET_URL = 'https://studio-nexora.com'
const BACKLINKS_FILE = path.join(process.cwd(), 'seo-backlinks.json')

// Lista de sitios para backlinks (directorios, foros, social, etc.)
const backlinkSites = [
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/submit',
    method: 'GET',
    params: { url: TARGET_URL, title: 'Studio Nexora Comet - AI Photo Studio' },
    description: 'Submit to Reddit',
  },
  {
    name: 'Tumblr',
    url: 'https://www.tumblr.com/new/text',
    method: 'GET',
    description: 'Post on Tumblr (manual)',
  },
  {
    name: 'Mix',
    url: 'https://mix.com/add',
    method: 'GET',
    params: { url: TARGET_URL },
    description: 'Add to Mix',
  },
  {
    name: 'Pinterest',
    url: 'https://www.pinterest.com/pin-builder/',
    method: 'GET',
    description: 'Pin on Pinterest (manual)',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/sharing/share-offsite/',
    method: 'GET',
    params: { url: TARGET_URL },
    description: 'Share on LinkedIn',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/sharer/sharer.php',
    method: 'GET',
    params: { u: TARGET_URL },
    description: 'Share on Facebook',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/intent/tweet',
    method: 'GET',
    params: {
      url: TARGET_URL,
      text: 'Check out Studio Nexora Comet - AI Photo Studio!',
    },
    description: 'Tweet about it',
  },
]

// Directorios y sitios de backlinks (ejemplos)
const directorySites = [
  {
    name: 'DMOZ Alternative',
    url: 'https://www.dmoz-odp.org/',
    description: 'Open Directory Project alternative',
  },
  {
    name: 'Crunchbase',
    url: 'https://www.crunchbase.com/',
    description: 'Company directory',
  },
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/',
    description: 'Product directory',
  },
]

async function generateBacklinkURLs() {
  console.log('🔗 ==========================================')
  console.log('🔗 SEO BACKLINKS AUTOMATION')
  console.log('🔗 ==========================================')
  console.log(`🎯 Target URL: ${TARGET_URL}`)
  console.log('')

  const backlinks = []

  // Generar URLs de backlinks
  console.log('📋 Generando URLs de backlinks...')
  console.log('')

  backlinkSites.forEach((site) => {
    let backlinkUrl = site.url
    if (site.params) {
      const params = new URLSearchParams(site.params)
      backlinkUrl += `?${params.toString()}`
    }

    backlinks.push({
      name: site.name,
      url: backlinkUrl,
      method: site.method || 'GET',
      description: site.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    console.log(`✅ ${site.name}`)
    console.log(`   URL: ${backlinkUrl}`)
    console.log(`   Descripción: ${site.description}`)
    console.log('')
  })

  // Agregar directorios
  console.log('📁 Directorios sugeridos:')
  directorySites.forEach((dir) => {
    backlinks.push({
      name: dir.name,
      url: dir.url,
      method: 'MANUAL',
      description: dir.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
    console.log(`   - ${dir.name}: ${dir.url}`)
  })

  console.log('')

  // Guardar backlinks
  let existingBacklinks = []
  if (fs.existsSync(BACKLINKS_FILE)) {
    existingBacklinks = JSON.parse(fs.readFileSync(BACKLINKS_FILE, 'utf8'))
  }

  // Agregar nuevos backlinks (evitar duplicados)
  const existingNames = new Set(existingBacklinks.map((b) => b.name))
  const newBacklinks = backlinks.filter((b) => !existingNames.has(b.name))

  if (newBacklinks.length > 0) {
    existingBacklinks.push(...newBacklinks)
    fs.writeFileSync(BACKLINKS_FILE, JSON.stringify(existingBacklinks, null, 2))
    console.log(`✅ ${newBacklinks.length} nuevos backlinks agregados`)
  } else {
    console.log('ℹ️  No hay nuevos backlinks para agregar')
  }

  console.log(`📝 Total backlinks: ${existingBacklinks.length}`)
  console.log(`📂 Archivo: ${BACKLINKS_FILE}`)
  console.log('')

  // Generar reporte HTML
  generateBacklinksReport(existingBacklinks)

  return existingBacklinks
}

function generateBacklinksReport(backlinks) {
  const reportPath = path.join(process.cwd(), 'seo-backlinks-report.html')
  const pending = backlinks.filter((b) => b.status === 'pending')
  const completed = backlinks.filter((b) => b.status === 'completed')
  const failed = backlinks.filter((b) => b.status === 'failed')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Backlinks Report - Studio Nexora Comet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #fff; }
    h1 { color: #4CAF50; }
    .stats { display: flex; gap: 20px; margin: 20px 0; }
    .stat { background: #2a2a2a; padding: 15px; border-radius: 8px; }
    .stat-number { font-size: 2em; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #444; }
    th { background: #333; }
    tr:hover { background: #2a2a2a; }
    .status-pending { color: #ffa500; }
    .status-completed { color: #4CAF50; }
    .status-failed { color: #f44336; }
    a { color: #4CAF50; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>🔗 SEO Backlinks Report</h1>
  <p>Target URL: <strong>${TARGET_URL}</strong></p>
  <p>Generated: ${new Date().toLocaleString()}</p>
  
  <div class="stats">
    <div class="stat">
      <div class="stat-number">${backlinks.length}</div>
      <div>Total Backlinks</div>
    </div>
    <div class="stat">
      <div class="stat-number">${completed.length}</div>
      <div>Completed</div>
    </div>
    <div class="stat">
      <div class="stat-number">${pending.length}</div>
      <div>Pending</div>
    </div>
    <div class="stat">
      <div class="stat-number">${failed.length}</div>
      <div>Failed</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>URL</th>
        <th>Status</th>
        <th>Description</th>
        <th>Created</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      ${backlinks
        .map(
          (b) => `
      <tr>
        <td>${b.name}</td>
        <td><a href="${b.url}" target="_blank">${b.url.substring(0, 60)}...</a></td>
        <td class="status-${b.status}">${b.status}</td>
        <td>${b.description || ''}</td>
        <td>${new Date(b.createdAt).toLocaleDateString()}</td>
        <td><a href="${b.url}" target="_blank">Open</a></td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>`

  fs.writeFileSync(reportPath, html)
  console.log(`📄 Reporte HTML generado: ${reportPath}`)
}

// Ejecutar
generateBacklinkURLs()
  .then(() => {
    console.log('✅ Proceso completado!')
  })
  .catch((error) => {
    console.error('❌ Error:', error)
  })

