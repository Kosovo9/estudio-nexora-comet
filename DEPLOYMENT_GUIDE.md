# 🚀 Guía de Despliegue Completo - Studio Nexora Comet

Esta guía te ayudará a desplegar Studio Nexora Comet en GitHub, Vercel y Cloudflare.

## 📋 Prerrequisitos

1. **Cuenta de GitHub** con el repositorio configurado
2. **Cuenta de Vercel** (gratis en https://vercel.com)
3. **Cuenta de Cloudflare** (gratis en https://cloudflare.com)
4. **Node.js** instalado (v20 o superior)
5. **Git** instalado y configurado

## 🔧 Paso 1: Preparación Local

### 1.1 Instalar Dependencias

```bash
npm install
```

### 1.2 Verificar Build

```bash
npm run build
```

Si el build es exitoso, puedes continuar.

## 📤 Paso 2: Despliegue a GitHub

### 2.1 Verificar Estado de Git

```bash
git status
```

### 2.2 Agregar Cambios

```bash
git add .
```

### 2.3 Hacer Commit

```bash
git commit -m "feat: Implementar Tierra 3D realista con control de rotación"
```

### 2.4 Push a GitHub

```bash
git push origin main
```

**O usar el script automatizado:**

**Linux/Mac:**
```bash
chmod +x scripts/deploy-complete.sh
./scripts/deploy-complete.sh
```

**Windows:**
```cmd
scripts\deploy-complete.bat
```

## ☁️ Paso 3: Despliegue en Vercel

### 3.1 Opción A: Desde la Web (Recomendado)

1. Ve a https://vercel.com
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "Add New Project"
4. Selecciona el repositorio `estudio-nexora-comet`
5. Vercel detectará automáticamente Next.js
6. Configura las variables de entorno si es necesario
7. Haz clic en "Deploy"

### 3.2 Opción B: Desde CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel --prod
```

### 3.3 Configuración de Vercel

El archivo `vercel.json` ya está configurado con:
- Build command: `npm run build`
- Framework: Next.js
- Región: `iad1` (US East)

### 3.4 Variables de Entorno

Asegúrate de configurar estas variables en Vercel Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_supabase
STRIPE_SECRET_KEY=tu_stripe_secret
CLERK_SECRET_KEY=tu_clerk_secret
```

## 🌐 Paso 4: Configuración de Cloudflare

### 4.1 Agregar Dominio a Cloudflare

1. Inicia sesión en https://dash.cloudflare.com
2. Haz clic en "Add a Site"
3. Ingresa tu dominio
4. Sigue las instrucciones para cambiar los nameservers

### 4.2 Configurar DNS

1. Ve a la sección "DNS" de tu dominio
2. Agrega un registro **CNAME**:
   - **Nombre**: `@` o `www`
   - **Destino**: `cname.vercel-dns.com` (o tu URL de Vercel)
   - **Proxy**: ✅ Activado (nube naranja)

### 4.3 Configurar SSL/TLS

1. Ve a la sección "SSL/TLS"
2. Selecciona el modo **"Full"** o **"Full (strict)"**
3. Esto asegura conexiones HTTPS seguras

### 4.4 Optimizaciones Adicionales

1. **Speed**: Activa "Auto Minify" para JS, CSS y HTML
2. **Caching**: Configura reglas de caché para assets estáticos
3. **Page Rules**: Crea reglas para mejorar rendimiento

## 🔄 Paso 5: Despliegue Automatizado (CI/CD)

### 5.1 GitHub Actions (Opcional)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 5.2 Configurar Secrets en GitHub

1. Ve a Settings > Secrets and variables > Actions
2. Agrega:
   - `VERCEL_TOKEN`: Token de Vercel
   - `VERCEL_ORG_ID`: ID de tu organización
   - `VERCEL_PROJECT_ID`: ID de tu proyecto

## ✅ Verificación Post-Despliegue

### Checklist

- [ ] Build local exitoso
- [ ] Push a GitHub completado
- [ ] Despliegue en Vercel exitoso
- [ ] Dominio configurado en Cloudflare
- [ ] DNS apuntando correctamente
- [ ] SSL/TLS activado
- [ ] Sitio accesible vía HTTPS
- [ ] Texturas de la Tierra cargadas (si aplica)

### Comandos de Verificación

```bash
# Verificar build
npm run build

# Verificar linting
npm run lint

# Ejecutar tests (si existen)
npm run test

# Verificar en local
npm run dev
```

## 🐛 Solución de Problemas

### Error: Build falla en Vercel

- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel Dashboard
- Asegúrate de que las variables de entorno estén configuradas

### Error: Dominio no resuelve

- Verifica que los nameservers estén actualizados
- Espera 24-48 horas para propagación DNS
- Verifica la configuración DNS en Cloudflare

### Error: SSL/TLS no funciona

- Verifica que el modo SSL esté en "Full" o "Full (strict)"
- Asegúrate de que Vercel tenga un certificado válido
- Revisa la configuración de certificados en Cloudflare

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Cloudflare](https://developers.cloudflare.com/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu aplicación estará desplegada y accesible en producción.

Para actualizaciones futuras, simplemente:
1. Haz cambios localmente
2. `git add . && git commit -m "mensaje" && git push`
3. Vercel desplegará automáticamente (si tienes integración)
4. Cloudflare actualizará el caché automáticamente

