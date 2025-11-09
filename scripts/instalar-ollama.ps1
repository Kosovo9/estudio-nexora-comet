# Script para instalar Ollama en Windows
# Ollama permite ejecutar modelos de IA localmente sin depender de APIs externas

Write-Host "🚀 Instalando Ollama..." -ForegroundColor Green
Write-Host ""

# Verificar si Ollama ya está instalado
$ollamaPath = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
if (Test-Path $ollamaPath) {
    Write-Host "✅ Ollama ya está instalado en: $ollamaPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Agregando Ollama al PATH..." -ForegroundColor Cyan
    
    # Agregar al PATH del usuario actual
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $ollamaDir = "$env:LOCALAPPDATA\Programs\Ollama"
    
    if ($currentPath -notlike "*$ollamaDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$ollamaDir", "User")
        $env:Path = "$env:Path;$ollamaDir"
        Write-Host "✅ Ollama agregado al PATH" -ForegroundColor Green
    } else {
        Write-Host "✅ Ollama ya está en el PATH" -ForegroundColor Green
    }
} else {
    Write-Host "📥 Descargando e instalando Ollama..." -ForegroundColor Cyan
    
    # Descargar Ollama para Windows
    $ollamaUrl = "https://ollama.com/download/windows"
    $installerPath = "$env:TEMP\ollama-installer.exe"
    
    Write-Host "   Descargando desde: $ollamaUrl" -ForegroundColor Gray
    Write-Host "   Guardando en: $installerPath" -ForegroundColor Gray
    
    try {
        # Intentar descargar usando winget (método recomendado)
        Write-Host ""
        Write-Host "Instalando Ollama usando winget..." -ForegroundColor Cyan
        winget install Ollama.Ollama --silent --accept-package-agreements --accept-source-agreements
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Ollama instalado exitosamente" -ForegroundColor Green
            
            # Agregar al PATH
            $ollamaDir = "$env:LOCALAPPDATA\Programs\Ollama"
            $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
            if ($currentPath -notlike "*$ollamaDir*") {
                [Environment]::SetEnvironmentVariable("Path", "$currentPath;$ollamaDir", "User")
                $env:Path = "$env:Path;$ollamaDir"
            }
        } else {
            Write-Host "⚠️  winget falló. Por favor instala Ollama manualmente desde: https://ollama.com/download/windows" -ForegroundColor Yellow
            Write-Host "   Después de instalar, ejecuta este script nuevamente." -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "❌ Error al instalar Ollama: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor instala Ollama manualmente:" -ForegroundColor Yellow
        Write-Host "1. Ve a: https://ollama.com/download/windows" -ForegroundColor Yellow
        Write-Host "2. Descarga e instala el instalador" -ForegroundColor Yellow
        Write-Host "3. Ejecuta este script nuevamente" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "🔍 Verificando instalación..." -ForegroundColor Cyan

# Verificar que ollama esté disponible
$ollamaDir = "$env:LOCALAPPDATA\Programs\Ollama"
$env:Path = "$env:Path;$ollamaDir"

Start-Sleep -Seconds 2

try {
    $version = & "$ollamaDir\ollama.exe" --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Ollama está funcionando correctamente" -ForegroundColor Green
        Write-Host "   Versión: $version" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Ollama instalado pero no responde. Puede necesitar reiniciar la terminal." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  No se pudo verificar Ollama. Puede necesitar reiniciar la terminal." -ForegroundColor Yellow
    Write-Host "   Intenta ejecutar: ollama --version" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📥 Descargando modelos de IA..." -ForegroundColor Cyan
Write-Host ""

# Descargar modelos
Write-Host "1. Descargando qwen3..." -ForegroundColor Yellow
& "$ollamaDir\ollama.exe" pull qwen3

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ qwen3 descargado exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Error al descargar qwen3" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Descargando deepseek-r1:8b..." -ForegroundColor Yellow
& "$ollamaDir\ollama.exe" pull deepseek-r1:8b

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ deepseek-r1:8b descargado exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Error al descargar deepseek-r1:8b" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Listando modelos instalados..." -ForegroundColor Cyan
& "$ollamaDir\ollama.exe" list

Write-Host ""
Write-Host "✅ Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Ventaja: Ahora tienes IA poderosa localmente, sin depender de APIs externas." -ForegroundColor Cyan
Write-Host ""
Write-Host "Para usar Ollama en una nueva terminal, cierra y abre PowerShell nuevamente." -ForegroundColor Yellow

