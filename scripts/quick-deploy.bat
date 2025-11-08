@echo off
REM Script rápido de despliegue (solo push a GitHub)
REM Vercel se encargará del despliegue automático si está configurado

echo 🚀 Despliegue rápido a GitHub...
echo.

REM Verificar build
echo 📦 Verificando build...
call npm run build

if errorlevel 1 (
    echo ❌ Error: El build falló.
    exit /b 1
)

REM Push a GitHub
echo 📤 Haciendo push a GitHub...
git add .
git commit -m "chore: Actualización automática" || echo No hay cambios para commitear
git push origin main

if errorlevel 1 (
    echo ❌ Error: El push falló.
    exit /b 1
)

echo ✅ Push completado. Vercel desplegará automáticamente si está configurado.
pause

