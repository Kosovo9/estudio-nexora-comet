#!/bin/bash

# Script de Despliegue Completo para Studio Nexora Comet
# Este script automatiza el proceso de despliegue a GitHub, Vercel y Cloudflare

set -e  # Salir si hay algún error

echo "🚀 Iniciando despliegue completo de Studio Nexora Comet..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# 2. Verificar que Git está configurado
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Este directorio no es un repositorio Git."
    exit 1
fi

# 3. Ejecutar tests y build
echo -e "${BLUE}📦 Ejecutando build del proyecto...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: El build falló. Corrige los errores antes de continuar."
    exit 1
fi

echo -e "${GREEN}✅ Build completado exitosamente${NC}"

# 4. Verificar cambios pendientes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  No hay cambios para commitear.${NC}"
else
    echo -e "${BLUE}📝 Hay cambios pendientes. Por favor, haz commit manualmente antes de continuar.${NC}"
    git status
    read -p "¿Deseas continuar con el push? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 5. Push a GitHub
echo -e "${BLUE}📤 Haciendo push a GitHub...${NC}"
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Error: El push a GitHub falló."
    exit 1
fi

echo -e "${GREEN}✅ Push a GitHub completado${NC}"

# 6. Verificar Vercel CLI
if command -v vercel &> /dev/null; then
    echo -e "${BLUE}☁️  Desplegando a Vercel...${NC}"
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Despliegue a Vercel completado${NC}"
    else
        echo -e "${YELLOW}⚠️  El despliegue a Vercel falló o fue cancelado.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado. Instálalo con: npm i -g vercel${NC}"
    echo -e "${YELLOW}   O despliega manualmente desde https://vercel.com${NC}"
fi

# 7. Información sobre Cloudflare
echo -e "${BLUE}🌐 Configuración de Cloudflare:${NC}"
echo -e "${YELLOW}   1. Ve a tu panel de Cloudflare${NC}"
echo -e "${YELLOW}   2. Configura DNS para apuntar a tu dominio de Vercel${NC}"
echo -e "${YELLOW}   3. Habilita proxy (nube naranja) para CDN y protección DDoS${NC}"
echo -e "${YELLOW}   4. Configura SSL/TLS en modo 'Full' o 'Full (strict)'${NC}"

# 8. Resumen
echo ""
echo -e "${GREEN}✨ Despliegue completado exitosamente!${NC}"
echo ""
echo "📋 Resumen:"
echo "   ✅ Build: Completado"
echo "   ✅ GitHub: Push realizado"
echo "   ✅ Vercel: Verificar en dashboard"
echo "   ⚠️  Cloudflare: Configurar manualmente"
echo ""
echo "🔗 URLs importantes:"
echo "   - GitHub: https://github.com/[tu-usuario]/estudio-nexora-comet"
echo "   - Vercel: https://vercel.com/dashboard"
echo "   - Cloudflare: https://dash.cloudflare.com"

