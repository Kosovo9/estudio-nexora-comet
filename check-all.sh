#!/bin/bash

# REVISIÓN INTEGRAL DE STUDIO NEXORA COMET
# Revisa carpetas, subcarpetas, archivos, errores, sintaxis y QA

set -e

echo "🔍 =========================================="
echo "🔍 REVISIÓN INTEGRAL STUDIO NEXORA COMET"
echo "🔍 =========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar errores
error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

# Función para mostrar éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencia
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "📁 1. Verificando estructura de carpetas..."
REQUIRED_DIRS=("app" "components" "lib" "hooks" "cypress" "scripts" ".github")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        success "Directorio $dir existe"
    else
        error "Directorio $dir NO existe"
    fi
done
echo ""

echo "📦 2. Verificando dependencias..."
if [ -f "package.json" ]; then
    success "package.json encontrado"
    npm ls --depth=1 2>&1 | head -20 || warning "Algunas dependencias pueden tener problemas"
else
    error "package.json NO encontrado"
fi
echo ""

echo "🔒 3. Verificando seguridad de dependencias..."
npm audit --audit-level=moderate || warning "Algunas vulnerabilidades encontradas (revisar manualmente)"
echo ""

echo "📝 4. Verificando archivos de configuración..."
CONFIG_FILES=("tsconfig.json" "next.config.js" "tailwind.config.js" "cypress.config.ts" ".eslintrc.json")
for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "$file existe"
    else
        warning "$file NO encontrado (puede ser opcional)"
    fi
done
echo ""

echo "🌐 5. Verificando variables de entorno..."
if [ -f ".env.local" ]; then
    success ".env.local encontrado"
    echo "  Verificando claves importantes..."
    grep -q "SUPABASE" .env.local && success "  SUPABASE configurado" || warning "  SUPABASE no encontrado"
    grep -q "CLERK" .env.local && success "  CLERK configurado" || warning "  CLERK no encontrado"
    grep -q "STRIPE" .env.local && success "  STRIPE configurado" || warning "  STRIPE no encontrado"
    grep -q "GOOGLE" .env.local && success "  GOOGLE AI configurado" || warning "  GOOGLE AI no encontrado"
else
    warning ".env.local NO encontrado (crear con las claves necesarias)"
fi
echo ""

echo "🔧 6. Verificando TypeScript..."
if command -v npx &> /dev/null; then
    echo "  Ejecutando TypeScript check..."
    npx tsc --noEmit --pretty --skipLibCheck 2>&1 | head -50 || error "Errores de TypeScript encontrados"
else
    error "npx no disponible"
fi
echo ""

echo "🧹 7. Verificando ESLint..."
if command -v npx &> /dev/null; then
    echo "  Ejecutando ESLint..."
    npm run lint 2>&1 | head -50 || warning "Algunos warnings de ESLint (revisar manualmente)"
else
    error "npm no disponible"
fi
echo ""

echo "🏗️  8. Verificando build..."
echo "  Ejecutando build de Next.js..."
npm run build 2>&1 | tail -30 || error "Build falló"
echo ""

echo "🧪 9. Verificando Cypress..."
if [ -d "cypress" ]; then
    success "Directorio cypress existe"
    if [ -f "cypress.config.ts" ] || [ -f "cypress.config.js" ]; then
        success "Configuración de Cypress encontrada"
    else
        warning "Configuración de Cypress no encontrada"
    fi
else
    error "Directorio cypress NO existe"
fi
echo ""

echo "📊 10. Verificando estructura de componentes críticos..."
CRITICAL_COMPONENTS=(
    "components/AIGeneration.tsx"
    "components/PhotoUpload.tsx"
    "components/PaymentForm.tsx"
    "components/MegaUI.tsx"
    "components/CopilotWidget.tsx"
    "components/QAWidget.tsx"
    "components/OnboardingModal.tsx"
    "components/Tooltip.tsx"
    "app/layout.tsx"
    "app/page.tsx"
)
for component in "${CRITICAL_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        success "$component existe"
    else
        error "$component NO existe"
    fi
done
echo ""

echo "🔗 11. Verificando API routes críticos..."
CRITICAL_API_ROUTES=(
    "app/api/upload/route.ts"
    "app/api/payments/stripe/route.ts"
    "app/api/admin/run-qa/route.ts"
    "app/api/copilot/chat/route.ts"
)
for route in "${CRITICAL_API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        success "$route existe"
    else
        warning "$route NO existe (puede ser opcional)"
    fi
done
echo ""

echo "📋 12. Resumen de archivos importantes..."
echo "  Componentes: $(find components -name '*.tsx' -o -name '*.ts' | wc -l)"
echo "  API Routes: $(find app/api -name 'route.ts' | wc -l)"
echo "  Tests Cypress: $(find cypress/e2e -name '*.cy.ts' | wc -l)"
echo "  Scripts: $(find scripts -name '*.js' | wc -l)"
echo ""

echo "🎯 13. Verificando shortcuts de QA..."
if [ -f "run-qa.sh" ]; then
    success "run-qa.sh existe"
    chmod +x run-qa.sh 2>/dev/null || warning "No se pudo hacer ejecutable run-qa.sh"
else
    warning "run-qa.sh NO existe"
fi
echo ""

echo "✅ =========================================="
echo "✅ REVISIÓN COMPLETA"
echo "✅ =========================================="
echo ""
echo "📝 Próximos pasos:"
echo "  1. Revisar errores/warnings arriba"
echo "  2. Ejecutar: npm run test:e2e:full"
echo "  3. Ejecutar: npm run test:report"
echo "  4. Si todo está bien: git add . && git commit -m '...' && git push origin main"
echo ""

