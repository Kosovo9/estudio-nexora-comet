// SEO Alert Script - Envía alertas cuando el score SEO baja
// Ejecutar: node scripts/seo-alert.js
// Requiere: npm install nodemailer (opcional, para email)

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configuración
const THRESHOLD = 90 // Score mínimo aceptable (0-100)
const URL = process.env.SEO_URL || 'https://studio-nexora.com'
const ALERT_EMAIL = process.env.ALERT_EMAIL || 'admin@studio-nexora.com'
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL || ''

console.log('🔔 ==========================================')
console.log('🔔 SEO ALERT MONITOR')
console.log('🔔 ==========================================')
console.log('')
console.log(`📊 URL: ${URL}`)
console.log(`🎯 Threshold: ${THRESHOLD}`)
console.log('')

// Ejecutar Lighthouse
const outputPath = path.join(process.cwd(), 'seo-lh.json')
const command = `npx lighthouse "${URL}" --output json --output-path "${outputPath}" --chrome-flags="--headless" --only-categories=seo,accessibility,performance --quiet`

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error('❌ Error ejecutando Lighthouse:', err)
    return
  }

  try {
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
    const seoScore = Math.round((data.categories?.seo?.score || 0) * 100)
    const accessibilityScore = Math.round((data.categories?.accessibility?.score || 0) * 100)
    const performanceScore = Math.round((data.categories?.performance?.score || 0) * 100)

    console.log('📊 Scores obtenidos:')
    console.log(`   SEO: ${seoScore}/100`)
    console.log(`   Accessibility: ${accessibilityScore}/100`)
    console.log(`   Performance: ${performanceScore}/100`)
    console.log('')

    // Verificar threshold
    if (seoScore < THRESHOLD) {
      console.log('🚨 ==========================================')
      console.log('🚨 ALERTA: Score SEO bajo!')
      console.log('🚨 ==========================================')
      console.log(`   Score actual: ${seoScore}`)
      console.log(`   Threshold: ${THRESHOLD}`)
      console.log('')

      const alertMessage = `🚨 ALERTA SEO - Studio Nexora Comet

Score SEO: ${seoScore}/100 (Threshold: ${THRESHOLD})
URL: ${URL}
Fecha: ${new Date().toLocaleString()}

Scores completos:
- SEO: ${seoScore}/100
- Accessibility: ${accessibilityScore}/100
- Performance: ${performanceScore}/100

Revisa el reporte completo y corrige los problemas encontrados.
`

      // Enviar email (si está configurado)
      if (ALERT_EMAIL && ALERT_EMAIL !== 'admin@studio-nexora.com') {
        sendEmail(alertMessage, seoScore)
      }

      // Enviar a Slack (si está configurado)
      if (SLACK_WEBHOOK) {
        sendSlackAlert(seoScore, accessibilityScore, performanceScore)
      }

      // Guardar alerta en archivo
      const alertPath = path.join(process.cwd(), 'seo-alerts.json')
      let alerts = []
      if (fs.existsSync(alertPath)) {
        alerts = JSON.parse(fs.readFileSync(alertPath, 'utf8'))
      }
      alerts.push({
        date: new Date().toISOString(),
        seoScore,
        accessibilityScore,
        performanceScore,
        url: URL,
        threshold: THRESHOLD,
      })
      fs.writeFileSync(alertPath, JSON.stringify(alerts, null, 2))
      console.log(`📝 Alerta guardada en: ${alertPath}`)
    } else {
      console.log('✅ Score SEO OK!')
      console.log(`   ${seoScore} >= ${THRESHOLD}`)
    }

    // Limpiar archivo temporal
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath)
    }
  } catch (error) {
    console.error('❌ Error procesando resultados:', error)
  }
})

function sendEmail(message, score) {
  // Requiere nodemailer: npm install nodemailer
  try {
    const nodemailer = require('nodemailer')

    // Configurar transporter (ajusta según tu proveedor)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // O tu proveedor SMTP
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    })

    transporter.sendMail(
      {
        from: 'seo-bot@studio-nexora.com',
        to: ALERT_EMAIL,
        subject: `[ALERTA] Puntuación SEO baja: ${score}/100`,
        text: message,
        html: `<pre>${message}</pre>`,
      },
      (err) => {
        if (err) {
          console.log('⚠️  Error enviando email:', err.message)
        } else {
          console.log(`📧 Email enviado a: ${ALERT_EMAIL}`)
        }
      }
    )
  } catch (error) {
    console.log('⚠️  nodemailer no disponible. Instala: npm install nodemailer')
  }
}

function sendSlackAlert(seoScore, accessibilityScore, performanceScore) {
  const axios = require('axios').default || require('axios')

  const payload = {
    text: '🚨 Alerta SEO - Studio Nexora Comet',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🚨 Alerta SEO - Score bajo*\n\n*URL:* ${URL}\n*Fecha:* ${new Date().toLocaleString()}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*SEO:*\n${seoScore}/100 ${seoScore < THRESHOLD ? '❌' : '✅'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Accessibility:*\n${accessibilityScore}/100`,
          },
          {
            type: 'mrkdwn',
            text: `*Performance:*\n${performanceScore}/100`,
          },
          {
            type: 'mrkdwn',
            text: `*Threshold:*\n${THRESHOLD}/100`,
          },
        ],
      },
    ],
  }

  axios
    .post(SLACK_WEBHOOK, payload)
    .then(() => {
      console.log('📱 Alerta enviada a Slack')
    })
    .catch((err) => {
      console.log('⚠️  Error enviando a Slack:', err.message)
    })
}

