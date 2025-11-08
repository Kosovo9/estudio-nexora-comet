#!/bin/bash

# SEO Monitor Automático - Studio Nexora Comet
# Ejecutar: chmod +x scripts/seo-monitor.sh && ./scripts/seo-monitor.sh
# O programar con cron: 0 9 * * 1 /ruta/al/proyecto/scripts/seo-monitor.sh

echo "🔍 =========================================="
echo "🔍 SEO MONITOR AUTOMÁTICO"
echo "🔍 =========================================="
echo ""

DATE=$(date +%Y-%m-%d_%H-%M-%S)
REPORT_DIR="./seo-reports"
REPORT_FILE="$REPORT_DIR/seo-report-$DATE.html"

# Crear directorio si no existe
mkdir -p "$REPORT_DIR"

echo "📊 Generando reporte SEO con Lighthouse..."
echo "   URL: https://studio-nexora.com"
echo "   Fecha: $(date)"
echo ""

# Ejecutar Lighthouse
npx lighthouse https://studio-nexora.com \
  --output html \
  --output-path "$REPORT_FILE" \
  --chrome-flags="--headless" \
  --only-categories=seo,accessibility,performance \
  --quiet

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Reporte generado exitosamente!"
  echo "📂 Ubicación: $REPORT_FILE"
  echo ""

  # Abrir reporte según el sistema operativo
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🌐 Abriendo reporte en macOS..."
    open "$REPORT_FILE"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🌐 Abriendo reporte en Linux..."
    xdg-open "$REPORT_FILE" 2>/dev/null || echo "⚠️  Abre manualmente: $REPORT_FILE"
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "🌐 Abriendo reporte en Windows..."
    start "" "$REPORT_FILE"
  fi

  echo ""
  echo "✅ Revisión SEO global lista"
  echo ""
  echo "📋 Próximos pasos:"
  echo "   1. Revisa el reporte HTML generado"
  echo "   2. Corrige cualquier problema encontrado"
  echo "   3. Compara con reportes anteriores"
  echo ""
else
  echo ""
  echo "❌ Error generando reporte SEO"
  echo "   Verifica que Lighthouse esté instalado: npm install -g lighthouse"
  echo ""
  exit 1
fi

