#!/bin/bash

# PUSH TO PRODUCTION - Studio Nexora Comet
# Ejecuta revisión completa, tests y push a GitHub

set -e

echo "🚀 =========================================="
echo "🚀 PUSH TO PRODUCTION - STUDIO NEXORA COMET"
echo "🚀 =========================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    exit 1
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Verificar que estamos en la rama correcta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    warning "Estás en la rama: $CURRENT_BRANCH (no en main)"
    read -p "¿Continuar de todas formas? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 2. Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Cambios detectados:"
    git status --short
    echo ""
    read -p "¿Agregar todos los cambios? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
    else
        error "Hay cambios sin agregar. Abortando."
    fi
fi

# 3. Ejecutar revisión rápida
echo "🔍 Ejecutando revisión rápida..."
npm run lint || warning "Algunos warnings de lint (continuando...)"

# 4. Verificar build
echo "🏗️  Verificando build..."
npm run build || error "Build falló. Corrige los errores antes de hacer push."

# 5. Ejecutar tests (opcional, puede tardar)
read -p "¿Ejecutar tests E2E completos? (puede tardar varios minutos) (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧪 Ejecutando tests E2E..."
    npm run test:e2e:full || warning "Algunos tests fallaron (revisar manualmente)"
    npm run test:report || warning "Error generando reporte"
fi

# 6. Solicitar mensaje de commit
echo ""
echo "📝 Ingresa el mensaje de commit:"
read -p "> " COMMIT_MESSAGE

if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="feat: Studio Nexora Comet updates - $(date +%Y-%m-%d)"
    warning "Usando mensaje por defecto: $COMMIT_MESSAGE"
fi

# 7. Commit
echo "💾 Haciendo commit..."
git commit -m "$COMMIT_MESSAGE" || error "Error al hacer commit"

# 8. Push
echo "📤 Haciendo push a origin main..."
git push origin main || error "Error al hacer push"

success "✅ Push completado exitosamente!"
echo ""
echo "🌐 Tu sitio se desplegará automáticamente en Vercel"
echo "   Revisa: https://studio-nexora.com"
echo ""
echo "📊 Para verificar el deploy:"
echo "   1. Ve a https://vercel.com/dashboard"
echo "   2. Revisa el último deployment"
echo "   3. Verifica que el build fue exitoso"
echo ""

