# CI/CD Deployment Guide - Studio Nexora Comet

## 🚀 Flujo Completo de Deploy (GitHub → Vercel → Cloudflare)

### Orden Correcto para Zero-Downtime + Pipeline Seguro

Siempre sigue este orden para evitar problemas y mantener el sitio funcionando:

---

## 1. **Cambios Locales (Cursor/VSCode)**

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Verificar build local
npm run build

# Ejecutar tests QA
npm run test:e2e:full
```

### Verificar Cambios
- ✅ Todos los componentes funcionan
- ✅ No hay errores de TypeScript (`npm run build`)
- ✅ Tests QA pasan (`npm run test:e2e:full`)
- ✅ Variables de entorno configuradas (`.env.local`)

---

## 2. **Push a GitHub**

### Commits y Push
```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Generador de fotos AI y mejoras enterprise"

# Push a main branch
git push origin main
```

### Verificar en GitHub
- ✅ Cambios aparecen en el repositorio
- ✅ GitHub Actions se activa automáticamente
- ✅ Tests QA corren en CI/CD
- ✅ Build pasa sin errores

---

## 3. **GitHub Actions (CI/CD Automático)**

### Workflow Automático
El workflow `.github/workflows/cypress.yml` se ejecuta automáticamente en cada push:

1. **Checkout** del código
2. **Setup Node.js** (v18)
3. **Install dependencies** (`npm ci`)
4. **Run Cypress tests** (E2E, analytics, SEO, mobile, errors)
5. **Upload QA reports** como artefactos
6. **Send Slack/Discord alerts** si hay fallos

### Verificar en GitHub Actions
- ✅ Workflow se ejecuta sin errores
- ✅ Todos los tests pasan
- ✅ Reportes QA generados
- ✅ No hay alertas de fallos

---

## 4. **Vercel Deploy Automático**

### Deploy Automático
Vercel detecta el push a `main` y despliega automáticamente:

1. **Build** del proyecto Next.js
2. **Deploy** a producción
3. **Verificación** de dominio

### Configuración en Vercel Dashboard

1. **Project Settings > Domains**
   - Agregar `studio-nexora.com`
   - Agregar `www.studio-nexora.com` (opcional)

2. **Environment Variables**
   - `NEXT_PUBLIC_GA_ID` (Google Analytics)
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GOOGLE_AI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `SENTRY_DSN` (opcional)

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Verificar en Vercel Dashboard
- ✅ Deploy aparece como "Ready" (verde)
- ✅ Build logs sin errores
- ✅ Dominio configurado correctamente
- ✅ Variables de entorno configuradas

---

## 5. **Cloudflare (DNS y Protección)**

### Configuración DNS

**IMPORTANTE:** Solo gestiona DNS, NO muevas nada después del primer setup.

1. **DNS Records en Cloudflare:**
   ```
   Type: CNAME
   Name: @ (o studio-nexora)
   Target: cname.vercel-dns.com
   Proxy: Proxied (naranja)
   ```

2. **SSL/TLS Settings:**
   - Mode: Full (strict)
   - Always Use HTTPS: On

3. **Security Settings:**
   - Security Level: Medium
   - Bot Fight Mode: On (opcional)
   - Challenge Passage: 30 minutes

### ⚠️ **ADVERTENCIA CRÍTICA**

**NUNCA toques DNS después de la integración inicial**, a menos que sea mantenimiento crítico.

Si el sitio se congela o hay problemas:
1. ✅ **NO cambies DNS**
2. ✅ Corrige el código localmente
3. ✅ Repite los pasos 1-4 (Git → GitHub → Vercel)
4. ✅ El problema se resolverá automáticamente

---

## 6. **Verificación Post-Deploy**

### Checklist de Verificación

```bash
# 1. Verificar sitio en vivo
curl -I https://studio-nexora.com

# 2. Verificar build en Vercel
# Ir a Vercel Dashboard > Deployments > Verificar último deploy

# 3. Verificar tests QA
# Ir a GitHub Actions > Verificar último workflow

# 4. Verificar analytics
# Ir a Google Analytics > Verificar eventos
```

### Tests Manuales Post-Deploy

1. **Homepage**
   - ✅ Carga correctamente
   - ✅ Botones funcionan
   - ✅ Idioma ES/EN funciona

2. **Login (Clerk)**
   - ✅ Sign In funciona
   - ✅ Sign Up funciona
   - ✅ Redirección correcta

3. **AI Generation Flow**
   - ✅ Upload de fotos funciona
   - ✅ Consent form funciona
   - ✅ Style selector funciona
   - ✅ AI generation no se congela
   - ✅ Timer y progress bar funcionan
   - ✅ Timeout funciona (20-25s)
   - ✅ Mensajes de error claros

4. **Payment Flow**
   - ✅ Payment form carga
   - ✅ Stripe checkout funciona
   - ✅ Bank transfer form funciona

5. **Download**
   - ✅ Watermark preview funciona
   - ✅ Download sin watermark funciona
   - ✅ 24h temporary storage funciona

---

## 7. **Solución de Problemas**

### Problema: "El sitio se congela"

**Diagnóstico:**
1. Verifica logs en Vercel Dashboard
2. Verifica errores en Sentry (si configurado)
3. Verifica tests QA en GitHub Actions

**Solución:**
1. ✅ **NO cambies DNS en Cloudflare**
2. ✅ Revisa código localmente
3. ✅ Ejecuta `npm run test:e2e:full` localmente
4. ✅ Corrige el problema
5. ✅ Push a GitHub (`git push origin main`)
6. ✅ Vercel redeploy automáticamente

### Problema: "AI Generation se congela"

**Diagnóstico:**
- Verifica `GOOGLE_AI_API_KEY` en Vercel
- Verifica quota/credits de Google AI Studio
- Verifica logs en Vercel Functions

**Solución:**
1. Verifica API key en `.env.local` y Vercel
2. Verifica quota en Google AI Studio Dashboard
3. Mejora timeout en `components/AIGeneration.tsx` (ya implementado)
4. Verifica `lib/ai.ts` para errores

### Problema: "Build falla en Vercel"

**Diagnóstico:**
- Revisa build logs en Vercel Dashboard
- Verifica errores de TypeScript
- Verifica dependencias faltantes

**Solución:**
1. Ejecuta `npm run build` localmente
2. Corrige errores de TypeScript
3. Verifica `package.json` tiene todas las dependencias
4. Push a GitHub nuevamente

---

## 8. **Comandos Rápidos**

### Desarrollo Local
```bash
npm run dev          # Desarrollo
npm run build        # Build local
npm run start        # Producción local
npm run lint         # Linter
```

### Tests QA
```bash
npm run test:e2e:full        # Todos los tests
npm run test:ai-blocking     # Test de bloqueo AI
npm run test:bilingual       # Test bilingüe
npm run test:analytics       # Test analytics
npm run test:seo             # Test SEO
npm run test:mobile          # Test mobile
```

### Deploy
```bash
# 1. Verificar cambios
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "feat: Descripción del cambio"

# 4. Push (dispara deploy automático)
git push origin main
```

---

## 9. **Monitoreo Continuo**

### Dashboard y Métricas

1. **Vercel Dashboard**
   - Deployments
   - Analytics
   - Functions logs

2. **Google Analytics**
   - Eventos personalizados (`ai_image_generate_start`, `ai_image_generate_success`, `ai_image_generate_error`)
   - Conversiones
   - Usuarios

3. **Sentry** (si configurado)
   - Errores en tiempo real
   - Performance monitoring
   - Alertas críticas

4. **GitHub Actions**
   - Tests QA automáticos
   - Reportes HTML
   - Alertas Slack/Discord

---

## 10. **Resumen del Flujo**

```
┌─────────────────┐
│ 1. Local Dev    │ → npm run dev, tests, build
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Git Push     │ → git add, commit, push origin main
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. GitHub       │ → Actions corre tests QA automáticamente
│   Actions       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Vercel       │ → Deploy automático a producción
│   Deploy        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Cloudflare   │ → DNS proxy (NO tocar después del setup)
│   DNS           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Live Site    │ → https://studio-nexora.com
└─────────────────┘
```

---

## ✅ Checklist Final

Antes de considerar el deploy completo:

- [ ] Código funciona localmente (`npm run dev`)
- [ ] Build pasa sin errores (`npm run build`)
- [ ] Tests QA pasan (`npm run test:e2e:full`)
- [ ] Cambios commiteados y pusheados a GitHub
- [ ] GitHub Actions pasa sin errores
- [ ] Vercel deploy está "Ready" (verde)
- [ ] Dominio configurado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] DNS configurado en Cloudflare (CNAME a Vercel)
- [ ] Sitio carga correctamente en `https://studio-nexora.com`
- [ ] Tests manuales pasan (login, AI generation, payment)
- [ ] Analytics funcionando (Google Analytics)
- [ ] Error tracking funcionando (Sentry, si configurado)

---

## 🎯 Regla de Oro

**Si algo falla:**
1. ✅ **NO cambies DNS en Cloudflare**
2. ✅ Corrige el código
3. ✅ Push a GitHub
4. ✅ Vercel redeploy automáticamente
5. ✅ El problema se resuelve

**El DNS en Cloudflare solo se toca una vez al inicio. Después, todo se maneja desde código.**

---

¡Listo! Tu pipeline CI/CD está configurado para zero-downtime y despliegues seguros. 🚀

