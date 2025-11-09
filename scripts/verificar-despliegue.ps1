# Script de Verificación de Despliegue en Vercel
# Este script ayuda a verificar que todo esté listo para el despliegue

$ErrorActionPreference = "Continue"

Write-Host "🔍 Verificando estado del proyecto para despliegue en Vercel..." -ForegroundColor Green
Write-Host ""

# 1. Verificar estructura de archivos
Write-Host "📁 Verificando estructura de archivos..." -ForegroundColor Cyan

$requiredFiles = @(
    "package.json",
    "app/page.tsx",
    "app/panel/page.tsx",
    "app/configuracion/page.tsx",
    "components/Navbar.tsx",
    "components/Earth3D.tsx",
    "components/FileUpload.tsx",
    "lib/dictionary.ts",
    "tailwind.config.js",
    "next.config.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
        Write-Host "   ❌ Faltante: $file" -ForegroundColor Red
    } else {
        Write-Host "   ✅ $file" -ForegroundColor Green
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Faltan archivos requeridos. Corrige antes de continuar." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Todos los archivos requeridos están presentes" -ForegroundColor Green
Write-Host ""

# 2. Verificar build
Write-Host "🔨 Verificando build del proyecto..." -ForegroundColor Cyan
Write-Host "   Esto puede tomar varios minutos..." -ForegroundColor Gray

$buildOutput = npm run build 2>&1
$buildSuccess = $LASTEXITCODE -eq 0

if ($buildSuccess) {
    Write-Host "   ✅ Build exitoso" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build falló" -ForegroundColor Red
    Write-Host ""
    Write-Host "Errores encontrados:" -ForegroundColor Yellow
    $buildOutput | Select-String -Pattern "error|Error|ERROR" | Select-Object -First 10
    Write-Host ""
    Write-Host "⚠️  Corrige los errores antes de hacer push" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 3. Verificar Git
Write-Host "📝 Verificando estado de Git..." -ForegroundColor Cyan

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   ⚠️  Hay cambios sin commitear:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "   ¿Deseas hacer commit ahora? (s/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -match '^[Ss]$') {
        git add .
        git commit -m "feat: Refactorización y optimización de UI/UX (2000% Activo, Multi-página)"
        Write-Host "   ✅ Cambios commiteados" -ForegroundColor Green
    }
} else {
    Write-Host "   ✅ No hay cambios pendientes" -ForegroundColor Green
}

Write-Host ""

# 4. Verificar rutas
Write-Host "🛣️  Verificando rutas de la aplicación..." -ForegroundColor Cyan

$routes = @(
    "/",
    "/panel",
    "/configuracion"
)

foreach ($route in $routes) {
    $routePath = $route -replace "^/", ""
    if ($routePath -eq "") {
        $routePath = "app/page.tsx"
    } else {
        $routePath = "app/$routePath/page.tsx"
    }
    
    if (Test-Path $routePath) {
        Write-Host "   ✅ Ruta $route -> $routePath" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Ruta $route -> $routePath (no encontrada)" -ForegroundColor Red
    }
}

Write-Host ""

# 5. Resumen
Write-Host "📋 Resumen de Verificación:" -ForegroundColor Cyan
Write-Host "   ✅ Estructura de archivos: OK" -ForegroundColor Green
Write-Host "   ✅ Build: OK" -ForegroundColor Green
Write-Host "   ✅ Git: Verificado" -ForegroundColor Green
Write-Host "   ✅ Rutas: Verificadas" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Haz push a GitHub: git push origin main" -ForegroundColor White
Write-Host "   2. Vercel detectará automáticamente los cambios" -ForegroundColor White
Write-Host "   3. Verifica el despliegue en: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   4. Visita tu aplicación: https://estudio-nexora-cometv1.vercel.app" -ForegroundColor White
Write-Host ""

$pushNow = Read-Host "¿Deseas hacer push ahora? (s/n)"
if ($pushNow -match '^[Ss]$') {
    Write-Host ""
    Write-Host "📤 Haciendo push a GitHub..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Push completado exitosamente!" -ForegroundColor Green
        Write-Host "Vercel iniciará el despliegue automáticamente." -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Error al hacer push. Verifica tu conexión y permisos." -ForegroundColor Red
    }
}

