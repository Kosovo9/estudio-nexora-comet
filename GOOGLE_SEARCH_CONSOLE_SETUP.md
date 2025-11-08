# 🔍 Google Search Console API - Setup Completo

## 📋 Pasos de Configuración

### 1. **Crear Proyecto en Google Cloud Console**

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra el proyecto: "Studio Nexora Comet SEO"

### 2. **Habilitar Google Search Console API**

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "Google Search Console API"
3. Haz clic en "Enable"

### 3. **Crear Credenciales OAuth 2.0**

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth client ID**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo: External
   - Nombre de la app: Studio Nexora Comet
   - Email de soporte: tu email
   - Guarda y continúa
4. Para OAuth client ID:
   - Tipo: **Desktop app** (o Web application)
   - Nombre: "Search Console Client"
   - Haz clic en **Create**
5. **Descarga el JSON** de credenciales
6. Guárdalo en la raíz del proyecto como: `google-credentials.json`

### 4. **Autenticación Inicial**

```bash
# 1. Ejecutar script principal (te dará una URL)
npm run seo:google-console

# 2. Abre la URL en el navegador
# 3. Autoriza la aplicación
# 4. Copia el código de autorización de la URL

# 5. Ejecutar script de autenticación con el código
npm run seo:google-auth <CODIGO>
```

### 5. **Uso Regular**

Una vez autenticado, puedes ejecutar:

```bash
# Obtener datos de Google Search Console
npm run seo:google-console
```

Los resultados se guardan en: `google-search-console-results.json`

## 📊 Datos Obtenidos

- **Search Analytics**: Clicks, impressions, queries, páginas, países, dispositivos
- **Sitemaps**: Estado de sitemaps enviados
- **Index Status**: Estado de indexación de URLs

## 🔐 Seguridad

**⚠️ IMPORTANTE:**

1. **NO subas `google-credentials.json` a Git**
   - Agrégalo a `.gitignore`:
     ```
     google-credentials.json
     google-token.json
     google-search-console-results.json
     ```

2. **Para producción (Vercel):**
   - Guarda las credenciales como variables de entorno
   - O usa un servicio de secretos (Vercel Secrets, AWS Secrets Manager, etc.)

## 🚀 Integración en Dashboard

El dashboard SEO (`/admin/seo`) incluye un botón para obtener datos de Google Search Console.

Los datos se muestran automáticamente después de ejecutar el script.

## 📝 Variables de Entorno (Opcional)

Puedes configurar rutas personalizadas:

```env
GOOGLE_CREDENTIALS_PATH=./path/to/credentials.json
GOOGLE_TOKEN_PATH=./path/to/token.json
```

## 🔧 Troubleshooting

### Error: "Credentials not found"
- Verifica que `google-credentials.json` esté en la raíz del proyecto
- O configura `GOOGLE_CREDENTIALS_PATH` en `.env.local`

### Error: "Token expired"
- Elimina `google-token.json`
- Ejecuta nuevamente el proceso de autenticación

### Error: "API not enabled"
- Ve a Google Cloud Console
- Habilita "Google Search Console API"

---

**Estado:** ✅ **GOOGLE SEARCH CONSOLE API CONFIGURADO**

**Última actualización:** 2024

