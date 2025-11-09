#!/bin/bash

# Script para mover texturas a public/textures
# Ejecuta este script cuando tengas los archivos de textura descargados

set -e

echo "📦 Moviendo texturas a public/textures..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Crear carpeta public/textures si no existe
mkdir -p public/textures

# Buscar archivos de textura en diferentes ubicaciones posibles
TEXTURE_FILES=()
FOUND_LOCATION=""

for location in "src/textures" "textures" "assets/textures" "."; do
    if [ -d "$location" ]; then
        FILES=$(find "$location" -maxdepth 1 -name "earth_*" 2>/dev/null || true)
        if [ -n "$FILES" ]; then
            FOUND_LOCATION="$location"
            TEXTURE_FILES=($(find "$location" -maxdepth 1 -name "earth_*" 2>/dev/null))
            echo "✅ Texturas encontradas en: $location"
            break
        fi
    fi
done

# Si no se encontraron, mostrar instrucciones
if [ ${#TEXTURE_FILES[@]} -eq 0 ]; then
    echo "⚠️  No se encontraron texturas en las ubicaciones comunes."
    echo ""
    echo "Por favor, coloca los archivos de textura en una de estas ubicaciones:"
    echo "   - src/textures/"
    echo "   - textures/"
    echo "   - assets/textures/"
    echo "   - O directamente en la raíz del proyecto"
    echo ""
    echo "Archivos requeridos:"
    echo "   - earth_daymap.jpg"
    echo "   - earth_clouds.png"
    echo "   - earth_specular.jpg"
    echo "   - earth_bump.jpg"
    exit 1
fi

# Mover archivos
echo ""
echo "📤 Moviendo archivos a public/textures..."

MOVED_COUNT=0
for file in "${TEXTURE_FILES[@]}"; do
    FILENAME=$(basename "$file")
    DEST="public/textures/$FILENAME"
    
    if [ -f "$DEST" ]; then
        echo "⚠️  $FILENAME ya existe en public/textures, omitiendo..."
    else
        mv "$file" "$DEST"
        echo "   ✅ Movido: $FILENAME"
        ((MOVED_COUNT++))
    fi
done

if [ $MOVED_COUNT -eq 0 ]; then
    echo "⚠️  No se movieron archivos nuevos."
    exit 0
fi

echo ""
echo "✅ $MOVED_COUNT archivo(s) movido(s) exitosamente"
echo ""

# Agregar a Git
echo "📝 Agregando cambios a Git..."
git add public/textures/*.jpg public/textures/*.png 2>/dev/null || true
git add public/textures 2>/dev/null || true

# Verificar si hay cambios para commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Creando commit..."
    git commit -m "fix: Mover texturas a public/textures para despliegue en Vercel"
    
    echo ""
    read -p "📤 ¿Deseas hacer push ahora? (s/n): " response
    if [[ "$response" =~ ^[Ss]$ ]]; then
        echo "🚀 Haciendo push a GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Push completado exitosamente!"
            echo "Vercel detectará los cambios y desplegará automáticamente."
        else
            echo ""
            echo "❌ Error al hacer push. Verifica tu conexión y permisos de Git."
        fi
    else
        echo ""
        echo "📝 Cambios preparados. Ejecuta 'git push' cuando estés listo."
    fi
else
    echo "⚠️  No hay cambios para commitear."
fi

echo ""
echo "✨ Proceso completado!"

