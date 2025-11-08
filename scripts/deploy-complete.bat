@echo off
REM Script de Despliegue Completo para Studio Nexora Comet (Windows)
REM Este script automatiza el proceso de despliegue a GitHub, Vercel y Cloudflare

setlocal enabledelayedexpansion

echo 🚀 Iniciando despliegue completo de Studio Nexora Comet...
echo.

REM 1. Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto.
    exit /b 1
)

REM 2. Verificar que Git está configurado
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Este directorio no es un repositorio Git.
    exit /b 1
)

REM 3. Ejecutar build
echo 📦 Ejecutando build del proyecto...
call npm run build

if errorlevel 1 (
    echo ❌ Error: El build falló. Corrige los errores antes de continuar.
    exit /b 1
)

echo ✅ Build completado exitosamente
echo.

REM 4. Verificar cambios pendientes
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ⚠️  No hay cambios para commitear.
) else (
    echo 📝 Hay cambios pendientes. Por favor, haz commit manualmente antes de continuar.
    git status
    set /p CONTINUE="¿Deseas continuar con el push? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        exit /b 1
    )
)

REM 5. Push a GitHub
echo 📤 Haciendo push a GitHub...
git push origin main

if errorlevel 1 (
    echo ❌ Error: El push a GitHub falló.
    exit /b 1
)

echo ✅ Push a GitHub completado
echo.

REM 6. Verificar Vercel CLI
where vercel >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Vercel CLI no está instalado. Instálalo con: npm i -g vercel
    echo    O despliega manualmente desde https://vercel.com
) else (
    echo ☁️  Desplegando a Vercel...
    call vercel --prod
    
    if errorlevel 1 (
        echo ⚠️  El despliegue a Vercel falló o fue cancelado.
    ) else (
        echo ✅ Despliegue a Vercel completado
    )
)

echo.
echo 🌐 Configuración de Cloudflare:
echo    1. Ve a tu panel de Cloudflare
echo    2. Configura DNS para apuntar a tu dominio de Vercel
echo    3. Habilita proxy (nube naranja) para CDN y protección DDoS
echo    4. Configura SSL/TLS en modo 'Full' o 'Full (strict)'
echo.

echo ✨ Despliegue completado exitosamente!
echo.
echo 📋 Resumen:
echo    ✅ Build: Completado
echo    ✅ GitHub: Push realizado
echo    ✅ Vercel: Verificar en dashboard
echo    ⚠️  Cloudflare: Configurar manualmente
echo.
echo 🔗 URLs importantes:
echo    - GitHub: https://github.com/[tu-usuario]/estudio-nexora-comet
echo    - Vercel: https://vercel.com/dashboard
echo    - Cloudflare: https://dash.cloudflare.com

pause

