// Supabase Backup Script
// Usage: node scripts/backupSupabase.js
// Automate with CRON or GitHub Actions

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Tables to backup
const tables = [
  'generations',
  'payments',
  'affiliates',
  'referrals',
  'tenants',
  'security_logs',
  'white_pages',
  'crm_tracking',
  'email_tracking',
  'temp_downloads',
  'copilot_history',
  'cms_content',
  'two_factor_auth',
]

// Create backups directory
const backupsDir = path.join(process.cwd(), 'backups')
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true })
}

async function exportTable(tableName) {
  try {
    console.log(`📊 Exporting table: ${tableName}...`)
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')

    if (error) {
      console.error(`❌ Error exporting ${tableName}:`, error.message)
      return false
    }

    // Export as JSON
    const jsonPath = path.join(backupsDir, `${tableName}-${Date.now()}.json`)
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8')
    console.log(`✅ Exported ${data?.length || 0} rows to ${jsonPath}`)

    // Export as CSV
    if (data && data.length > 0) {
      const csvPath = path.join(backupsDir, `${tableName}-${Date.now()}.csv`)
      const headers = Object.keys(data[0]).join(',')
      const rows = data.map((row) =>
        Object.values(row)
          .map((val) => (val === null ? '' : `"${String(val).replace(/"/g, '""')}"`))
          .join(',')
      )
      const csv = [headers, ...rows].join('\n')
      fs.writeFileSync(csvPath, csv, 'utf8')
      console.log(`✅ Exported CSV to ${csvPath}`)
    }

    return true
  } catch (error) {
    console.error(`❌ Error exporting ${tableName}:`, error)
    return false
  }
}

async function backupAll() {
  console.log('🚀 Starting Supabase backup...')
  console.log(`📁 Backup directory: ${backupsDir}`)
  console.log('')

  const results = []
  for (const table of tables) {
    const success = await exportTable(table)
    results.push({ table, success })
  }

  console.log('')
  console.log('📊 Backup Summary:')
  results.forEach(({ table, success }) => {
    console.log(`  ${success ? '✅' : '❌'} ${table}`)
  })

  const successCount = results.filter((r) => r.success).length
  console.log(`\n✅ ${successCount}/${tables.length} tables backed up successfully`)

  // Create backup manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    tables: results,
    totalTables: tables.length,
    successful: successCount,
  }
  fs.writeFileSync(
    path.join(backupsDir, `manifest-${Date.now()}.json`),
    JSON.stringify(manifest, null, 2),
    'utf8'
  )

  console.log('✅ Backup complete!')
}

// Run backup
backupAll().catch((error) => {
  console.error('❌ Backup failed:', error)
  process.exit(1)
})

