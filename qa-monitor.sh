#!/bin/bash

# QA Runner Mega Optimizado - Studio Nexora Comet
# Verifica todo el proyecto, ejecuta tests E2E, genera reporte y abre UI web final

set -e

echo "🔎 =========================================="
echo "🔎 QA MONITOR - STUDIO NEXORA COMET"
echo "🔎 =========================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Iniciando revisión profunda de Studio Nexora Comet...${NC}"
echo ""

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en la raíz del proyecto."
    exit 1
fi

# 2. Verificar dependencias instaladas
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules no encontrado. Instalando dependencias...${NC}"
    npm install
fi

# 3. Ejecutar tests E2E completos
echo -e "${BLUE}🧪 Ejecutando tests E2E completos...${NC}"
echo "   Esto puede tardar varios minutos..."
echo ""
npm run test:e2e:full || {
    echo ""
    echo -e "${YELLOW}⚠️  Algunos tests fallaron. Revisa el output arriba.${NC}"
    echo ""
}

# 4. Generar reporte HTML visual
echo ""
echo -e "${BLUE}📄 Generando reporte HTML visual QA...${NC}"
npm run test:report || {
    echo ""
    echo -e "${YELLOW}⚠️  Error generando reporte. Verifica que los tests se ejecutaron correctamente.${NC}"
    echo ""
}

# 5. Verificar que el reporte existe
REPORT_PATH="./cypress/reports/html/mochawesome.html"
if [ ! -f "$REPORT_PATH" ]; then
    # Intentar ruta alternativa
    REPORT_PATH="./cypress/reports/mochawesome.html"
fi

if [ -f "$REPORT_PATH" ]; then
    echo ""
    echo -e "${GREEN}✅ Reporte generado exitosamente${NC}"
    echo -e "${BLUE}📂 Ubicación: $REPORT_PATH${NC}"
    echo ""
    echo -e "${BLUE}🌐 Abriendo reporte visual QA...${NC}"
    
    # Abrir reporte según el sistema operativo
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$REPORT_PATH"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open "$REPORT_PATH" 2>/dev/null || {
            echo -e "${YELLOW}⚠️  No se pudo abrir automáticamente. Abre manualmente:${NC}"
            echo "   $REPORT_PATH"
        }
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows (Git Bash)
        start "$REPORT_PATH"
    else
        echo -e "${YELLOW}⚠️  Sistema operativo no reconocido. Abre manualmente:${NC}"
        echo "   $REPORT_PATH"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Reporte no encontrado en la ubicación esperada.${NC}"
    echo "   Busca en: ./cypress/reports/"
fi

echo ""
echo -e "${GREEN}✅ ==========================================${NC}"
echo -e "${GREEN}✅ REVISIÓN FINALIZADA${NC}"
echo -e "${GREEN}✅ ==========================================${NC}"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Revisa el reporte HTML para ver detalles de cada test"
echo "   2. Verifica que todos los botones y funciones estén correctos"
echo "   3. Si todo está bien, ejecuta: ./push-to-production.sh"
echo "   4. O manualmente: git add . && git commit -m '...' && git push origin main"
echo ""

