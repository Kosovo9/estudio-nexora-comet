# 🔍 SEO MONITORING COMPLETO - Implementación 1000x

## ✅ Componentes Implementados

### 1. **Script de Análisis de Keywords** (`scripts/seo-keywords-audit.js`)
- ✅ Analiza múltiples URLs
- ✅ Extrae title, description, keywords, H1
- ✅ Cuenta H2, H3, links, imágenes
- ✅ Verifica Schema.org, Open Graph, Twitter Cards
- ✅ Verifica Canonical URLs y Hreflang
- ✅ Genera resumen general

**Uso:**
```bash
npm run seo:keywords
# O directamente:
node scripts/seo-keywords-audit.js
```

### 2. **Monitor Automático SEO** (`scripts/seo-monitor.sh` / `scripts/seo-monitor.bat`)
- ✅ Ejecuta Lighthouse automáticamente
- ✅ Genera reportes HTML con timestamp
- ✅ Abre reporte automáticamente según OS
- ✅ Guarda reportes en `./seo-reports/`

**Uso:**
```bash
# Linux/Mac
npm run seo:monitor
# O directamente:
chmod +x scripts/seo-monitor.sh
./scripts/seo-monitor.sh

# Windows
scripts\seo-monitor.bat
```

**Programar con Cron (Linux/Mac):**
```bash
# Ejecutar cada lunes a las 9 AM
0 9 * * 1 /ruta/al/proyecto/scripts/seo-monitor.sh
```

**Programar con Task Scheduler (Windows):**
1. Abre Task Scheduler
2. Crea nueva tarea
3. Trigger: Semanal (Lunes, 9 AM)
4. Action: Ejecutar `scripts\seo-monitor.bat`

### 3. **Sistema de Alertas SEO** (`scripts/seo-alert.js`)
- ✅ Ejecuta Lighthouse y obtiene scores
- ✅ Compara con threshold (default: 90)
- ✅ Envía email si score baja (requiere nodemailer)
- ✅ Envía alerta a Slack si está configurado
- ✅ Guarda alertas en `seo-alerts.json`

**Uso:**
```bash
npm run seo:alert
# O directamente:
node scripts/seo-alert.js
```

**Configuración:**
```env
# .env.local
SEO_URL=https://studio-nexora.com
ALERT_EMAIL=admin@studio-nexora.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Instalar dependencias:**
```bash
npm install nodemailer axios
```

### 4. **Dashboard Visual SEO** (`/admin/seo`)
- ✅ Score Lighthouse actual (SEO, Accessibility, Performance)
- ✅ Keywords principales por idioma
- ✅ Alertas recibidas (última semana)
- ✅ Sugerencias de optimización
- ✅ Últimos reportes generados
- ✅ Botón para ejecutar auditoría SEO

**Acceso:**
- URL: `https://studio-nexora.com/admin/seo`
- Requiere autenticación (Clerk)
- Botón "SEO" agregado al Admin Panel

### 5. **API Routes SEO**
- ✅ `/api/admin/seo/scores` - Obtener scores históricos
- ✅ `/api/admin/seo/alerts` - Obtener alertas recientes
- ✅ `/api/admin/seo/keywords` - Obtener keywords por idioma
- ✅ `/api/admin/seo/audit` - Ejecutar auditoría SEO (POST)

## 📊 Scripts NPM Agregados

```json
{
  "seo:keywords": "node scripts/seo-keywords-audit.js",
  "seo:monitor": "bash scripts/seo-monitor.sh",
  "seo:alert": "node scripts/seo-alert.js"
}
```

## 🚀 Flujo de Trabajo Recomendado

### Diario
```bash
# Ejecutar alertas (verificar si hay problemas)
npm run seo:alert
```

### Semanal
```bash
# Generar reporte completo
npm run seo:monitor

# Analizar keywords
npm run seo:keywords
```

### Mensual
1. Revisar dashboard SEO: `/admin/seo`
2. Comparar scores con mes anterior
3. Implementar sugerencias de optimización
4. Actualizar keywords según análisis

## 📋 Checklist de Implementación

- [x] Script de análisis de keywords
- [x] Monitor automático SEO (Linux/Mac/Windows)
- [x] Sistema de alertas (Email/Slack)
- [x] Dashboard visual SEO
- [x] API routes para datos SEO
- [x] Integración con Admin Panel
- [ ] Configurar email (nodemailer)
- [ ] Configurar Slack webhook
- [ ] Programar cron/task scheduler
- [ ] Configurar variables de entorno

## 🔧 Configuración Avanzada

### Email Alerts (Gmail)
```javascript
// En scripts/seo-alert.js, configura:
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password, no contraseña normal
  },
})
```

**Obtener App Password de Gmail:**
1. Ve a: https://myaccount.google.com/apppasswords
2. Genera nueva contraseña de aplicación
3. Úsala en `EMAIL_PASSWORD`

### Slack Alerts
1. Ve a: https://api.slack.com/apps
2. Crea nueva app
3. Activa "Incoming Webhooks"
4. Copia el webhook URL
5. Agrega a `.env.local`: `SLACK_WEBHOOK_URL=...`

### Programar Automatización

**Linux/Mac (Cron):**
```bash
# Editar crontab
crontab -e

# Agregar línea (cada lunes 9 AM)
0 9 * * 1 cd /ruta/al/proyecto && npm run seo:monitor

# Alertas diarias (cada día 8 AM)
0 8 * * * cd /ruta/al/proyecto && npm run seo:alert
```

**Windows (Task Scheduler):**
1. Abre Task Scheduler
2. Crea tarea básica
3. Trigger: Diario/Semanal según necesidad
4. Action: Iniciar programa
   - Programa: `cmd.exe`
   - Argumentos: `/c cd /d C:\ruta\al\proyecto && npm run seo:monitor`

## 📈 Métricas Monitoreadas

### Lighthouse Scores
- **SEO**: 0-100 (threshold: 90)
- **Accessibility**: 0-100
- **Performance**: 0-100

### Keywords Analysis
- Title tags
- Meta descriptions
- Keywords meta tags
- H1, H2, H3 headings
- Alt tags en imágenes
- Schema.org markup
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Hreflang tags

## 🎯 Próximos Pasos

1. **Instalar dependencias:**
   ```bash
   npm install axios cheerio nodemailer
   ```

2. **Configurar variables de entorno:**
   ```env
   SEO_URL=https://studio-nexora.com
   ALERT_EMAIL=admin@studio-nexora.com
   SLACK_WEBHOOK_URL=...
   EMAIL_USER=...
   EMAIL_PASSWORD=...
   ```

3. **Probar scripts:**
   ```bash
   npm run seo:keywords
   npm run seo:monitor
   npm run seo:alert
   ```

4. **Acceder al dashboard:**
   - Ve a: `https://studio-nexora.com/admin/seo`
   - Revisa scores, alertas, keywords
   - Ejecuta auditoría manual si es necesario

5. **Programar automatización:**
   - Configura cron (Linux/Mac) o Task Scheduler (Windows)
   - Verifica que los reportes se generen correctamente

## 📝 Archivos Generados

- `seo-reports/seo-report-YYYY-MM-DD_HH-MM-SS.html` - Reportes Lighthouse
- `seo-alerts.json` - Historial de alertas
- `seo-lh-temp.json` - Archivo temporal (se elimina automáticamente)

## 🔍 Troubleshooting

### Error: "Lighthouse not found"
```bash
npm install -g lighthouse
# O usar npx (ya incluido en scripts)
```

### Error: "cheerio not found"
```bash
npm install cheerio axios
```

### Error: "nodemailer not found"
```bash
npm install nodemailer
```

### Scripts no ejecutables (Linux/Mac)
```bash
chmod +x scripts/seo-monitor.sh
```

---

**Estado:** ✅ **SEO MONITORING COMPLETO IMPLEMENTADO**

**Última actualización:** 2024
**Versión:** 1.0.0

