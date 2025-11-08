#!/bin/bash

# Script rápido de despliegue (solo push a GitHub)
# Vercel se encargará del despliegue automático si está configurado

set -e

echo "🚀 Despliegue rápido a GitHub..."

# Verificar build
echo "📦 Verificando build..."
npm run build

# Push a GitHub
echo "📤 Haciendo push a GitHub..."
git add .
git commit -m "chore: Actualización automática" || echo "No hay cambios para commitear"
git push origin main

echo "✅ Push completado. Vercel desplegará automáticamente si está configurado."

