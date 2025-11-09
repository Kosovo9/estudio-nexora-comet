# 🔐 Variables de Entorno Completas - Studio Nexora Comet

Este documento lista **TODAS** las variables de entorno necesarias para el proyecto. **NO se eliminará ninguna variable existente**.

## 📋 Variables Requeridas (Críticas)

### Autenticación - Clerk
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Base de Datos - Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Pagos - Stripe
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Inteligencia Artificial - Google AI
```env
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your-google-ai-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

### URL de la Aplicación
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📋 Variables Opcionales (Recomendadas)

### Analytics y Monitoreo
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/yyy
```

### Verificación de Motores de Búsqueda
```env
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-verification-code
NEXT_PUBLIC_BING_VERIFICATION=your-bing-verification-code
```

### Inteligencia Artificial - Alternativas
```env
OPENAI_API_KEY=sk-xxx
DEEPSEEK_API_KEY=sk-xxx
QWEN3_API_KEY=xxx
HUGGINGFACE_API_TOKEN=hf_xxx
```

### Notificaciones - Email
```env
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
QA_REPORT_EMAIL=recipient@example.com
ALERT_EMAIL=admin@studio-nexora.com
```

### Notificaciones - Webhooks
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_WEBHOOK=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### CMS y Contenido
```env
NOTION_API_KEY=secret_xxx
```

### Google Search Console
```env
GOOGLE_CREDENTIALS_PATH=./google-credentials.json
GOOGLE_TOKEN_PATH=./google-token.json
```

### SEO y Monitoreo
```env
SEO_URL=https://studio-nexora.com
```

### Token Refresh Personalizado
```env
CUSTOM_TOKEN_REFRESH_URL=https://your-api.com/refresh-token
```

## ⚠️ Notas Importantes

1. **Variables con prefijo `NEXT_PUBLIC_`**: Son accesibles en el cliente (navegador)
2. **Variables sin prefijo**: Solo accesibles en el servidor
3. **NO commitees** el archivo `.env.local` con valores reales
4. **Configura todas estas variables** en Vercel Dashboard → Settings → Environment Variables
5. **Para producción**, usa valores de producción (no `test_`)

## ✅ Verificación

Todas estas variables están siendo usadas en el código y **NO se eliminarán**. El código tiene fallbacks apropiados para cuando las variables opcionales no estén definidas.

