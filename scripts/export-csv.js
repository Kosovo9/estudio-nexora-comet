// Export CSV script
// Usage: npm run export:csv

const fs = require('fs')
const path = require('path')

// This is a placeholder - in production, fetch from API or database
const exportData = {
  generations: [],
  payments: [],
  errors: [],
}

function generateCSV(data) {
  const headers = ['Type', 'ID', 'User ID', 'Status', 'Created At', 'Details']
  const rows = [headers.join(',')]

  // Add data rows
  data.generations.forEach((item) => {
    rows.push([
      'Generation',
      item.id || 'N/A',
      item.user_id || 'N/A',
      item.status || 'N/A',
      item.created_at || 'N/A',
      item.details || 'N/A',
    ].join(','))
  })

  data.payments.forEach((item) => {
    rows.push([
      'Payment',
      item.id || 'N/A',
      item.user_id || 'N/A',
      item.status || 'N/A',
      item.created_at || 'N/A',
      `Amount: ${item.amount || 'N/A'}`,
    ].join(','))
  })

  return rows.join('\n')
}

// Generate CSV
const csv = generateCSV(exportData)
const outputPath = path.join(process.cwd(), 'exports', `nexora-export-${Date.now()}.csv`)

// Ensure exports directory exists
const exportsDir = path.join(process.cwd(), 'exports')
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true })
}

// Write file
fs.writeFileSync(outputPath, csv, 'utf8')
console.log(`✅ CSV exported to: ${outputPath}`)

