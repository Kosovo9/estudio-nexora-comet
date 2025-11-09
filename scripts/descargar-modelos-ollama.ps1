# Script para descargar modelos de Ollama
# Ejecuta este script después de instalar Ollama

Write-Host "📥 Descargando modelos de IA con Ollama..." -ForegroundColor Green
Write-Host ""

# Verificar que Ollama esté instalado
$ollamaPath = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
if (-not (Test-Path $ollamaPath)) {
    Write-Host "❌ Ollama no está instalado." -ForegroundColor Red
    Write-Host "   Por favor ejecuta primero: .\scripts\instalar-ollama.ps1" -ForegroundColor Yellow
    exit 1
}

# Agregar Ollama al PATH si no está
$ollamaDir = "$env:LOCALAPPDATA\Programs\Ollama"
if ($env:Path -notlike "*$ollamaDir*") {
    $env:Path = "$env:Path;$ollamaDir"
}

Write-Host "🔍 Verificando Ollama..." -ForegroundColor Cyan
$version = & "$ollamaPath" --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Ollama no responde. Puede necesitar reiniciar la terminal." -ForegroundColor Yellow
    Write-Host "   Intenta cerrar y abrir PowerShell nuevamente." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Ollama está funcionando" -ForegroundColor Green
Write-Host ""

# Descargar modelos
Write-Host "1️⃣  Descargando qwen3..." -ForegroundColor Yellow
Write-Host "   Esto puede tomar varios minutos dependiendo de tu conexión..." -ForegroundColor Gray
& "$ollamaPath" pull qwen3

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ qwen3 descargado exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al descargar qwen3" -ForegroundColor Red
}

Write-Host ""
Write-Host "2️⃣  Descargando deepseek-r1:8b..." -ForegroundColor Yellow
Write-Host "   Esto puede tomar varios minutos dependiendo de tu conexión..." -ForegroundColor Gray
& "$ollamaPath" pull deepseek-r1:8b

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ deepseek-r1:8b descargado exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al descargar deepseek-r1:8b" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Modelos instalados:" -ForegroundColor Cyan
& "$ollamaPath" list

Write-Host ""
Write-Host "✅ Proceso completado!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Ventaja: Ahora tienes IA poderosa localmente, sin depender de APIs externas." -ForegroundColor Cyan

