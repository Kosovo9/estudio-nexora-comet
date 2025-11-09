# Script para mover texturas a public/textures
# Ejecuta este script cuando tengas los archivos de textura descargados

$ErrorActionPreference = "Stop"

Write-Host "📦 Moviendo texturas a public/textures..." -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Crear carpeta public/textures si no existe
if (-not (Test-Path "public\textures")) {
    Write-Host "📁 Creando carpeta public/textures..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "public\textures" -Force | Out-Null
}

# Buscar archivos de textura en diferentes ubicaciones posibles
$possibleLocations = @(
    "src\textures",
    "textures",
    "assets\textures",
    "public\textures",
    "."
)

$textureFiles = @()
$foundLocation = $null

foreach ($location in $possibleLocations) {
    if (Test-Path $location) {
        $files = Get-ChildItem -Path $location -Filter "earth_*" -ErrorAction SilentlyContinue
        if ($files) {
            $foundLocation = $location
            $textureFiles = $files
            Write-Host "✅ Texturas encontradas en: $location" -ForegroundColor Green
            break
        }
    }
}

# Si no se encontraron, verificar si están en Downloads o Desktop
if (-not $textureFiles) {
    Write-Host "⚠️  No se encontraron texturas en las ubicaciones comunes." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor, coloca los archivos de textura en una de estas ubicaciones:" -ForegroundColor Cyan
    Write-Host "   - src/textures/" -ForegroundColor White
    Write-Host "   - textures/" -ForegroundColor White
    Write-Host "   - assets/textures/" -ForegroundColor White
    Write-Host "   - O directamente en la raíz del proyecto" -ForegroundColor White
    Write-Host ""
    Write-Host "Archivos requeridos:" -ForegroundColor Yellow
    Write-Host "   - earth_daymap.jpg" -ForegroundColor White
    Write-Host "   - earth_clouds.png" -ForegroundColor White
    Write-Host "   - earth_specular.jpg" -ForegroundColor White
    Write-Host "   - earth_bump.jpg" -ForegroundColor White
    exit 1
}

# Mover archivos
Write-Host ""
Write-Host "📤 Moviendo archivos a public/textures..." -ForegroundColor Cyan

$movedCount = 0
foreach ($file in $textureFiles) {
    $destPath = Join-Path "public\textures" $file.Name
    if (Test-Path $destPath) {
        Write-Host "⚠️  $($file.Name) ya existe en public/textures, omitiendo..." -ForegroundColor Yellow
    } else {
        Move-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "   ✅ Movido: $($file.Name)" -ForegroundColor Green
        $movedCount++
    }
}

if ($movedCount -eq 0) {
    Write-Host "⚠️  No se movieron archivos nuevos." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "✅ $movedCount archivo(s) movido(s) exitosamente" -ForegroundColor Green
Write-Host ""

# Agregar a Git
Write-Host "📝 Agregando cambios a Git..." -ForegroundColor Cyan
git add public/textures/*.jpg public/textures/*.png 2>$null
git add public/textures 2>$null

# Verificar si hay cambios para commitear
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Creando commit..." -ForegroundColor Cyan
    git commit -m "fix: Mover texturas a public/textures para despliegue en Vercel"
    
    Write-Host ""
    Write-Host "📤 ¿Deseas hacer push ahora? (s/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -match '^[Ss]$') {
        Write-Host "🚀 Haciendo push a GitHub..." -ForegroundColor Cyan
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Push completado exitosamente!" -ForegroundColor Green
            Write-Host "Vercel detectará los cambios y desplegará automáticamente." -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "❌ Error al hacer push. Verifica tu conexión y permisos de Git." -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "📝 Cambios preparados. Ejecuta 'git push' cuando estés listo." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  No hay cambios para commitear." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Proceso completado!" -ForegroundColor Green

