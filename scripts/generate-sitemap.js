// Script para generar sitemap.xml automáticamente
// Ejecutar: node scripts/generate-sitemap.js

const fs = require('fs')
const path = require('path')

const baseUrl = 'https://studio-nexora.com'

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/en', priority: '0.9', changefreq: 'daily' },
  { path: '/es', priority: '0.9', changefreq: 'daily' },
  { path: '/affiliates', priority: '0.7', changefreq: 'weekly' },
  { path: '/white-pages', priority: '0.6', changefreq: 'weekly' },
  { path: '/admin/dashboard', priority: '0.3', changefreq: 'monthly' },
]

const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

  routes.forEach((route) => {
    xml += `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <priority>${route.priority}</priority>
    <changefreq>${route.changefreq}</changefreq>
`

    // Add hreflang for main routes
    if (route.path === '/') {
      xml += `    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/en"/>
    <xhtml:link rel="alternate" hreflang="es-MX" href="${baseUrl}/es"/>
`
    }

    xml += `  </url>
`
  })

  xml += `</urlset>
`

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
  fs.writeFileSync(sitemapPath, xml, 'utf8')
  console.log('✅ Sitemap generado exitosamente en:', sitemapPath)
}

generateSitemap()

