# Script PowerShell para crear acceso directo QA en el escritorio
# Ejecutar: .\crear-acceso-directo-qa.ps1

Write-Host "🖥️  Creando acceso directo QA en el escritorio..." -ForegroundColor Cyan
Write-Host ""

# Obtener ruta del proyecto
$projectPath = $PSScriptRoot
$scriptPath = Join-Path $projectPath "qa-monitor.bat"
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "QA Nexora Comet.lnk"

# Verificar que el script existe
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Error: No se encontró qa-monitor.bat en:" -ForegroundColor Red
    Write-Host "   $scriptPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "📂 Proyecto: $projectPath" -ForegroundColor Green
Write-Host "📄 Script: $scriptPath" -ForegroundColor Green
Write-Host "🖥️  Escritorio: $desktopPath" -ForegroundColor Green
Write-Host ""

# Crear acceso directo
try {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = $scriptPath
    $Shortcut.WorkingDirectory = $projectPath
    $Shortcut.Description = "QA Monitor - Studio Nexora Comet - Ejecuta tests E2E y genera reporte"
    $Shortcut.IconLocation = "shell32.dll,23"  # Icono de documento/archivo
    $Shortcut.Save()
    
    Write-Host "✅ Acceso directo creado exitosamente!" -ForegroundColor Green
    Write-Host "   Ubicación: $shortcutPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Ve a tu escritorio" -ForegroundColor White
    Write-Host "   2. Busca 'QA Nexora Comet'" -ForegroundColor White
    Write-Host "   3. Doble click para ejecutar QA" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Para cambiar el icono:" -ForegroundColor Yellow
    Write-Host "   Click derecho → Propiedades → Cambiar icono" -ForegroundColor White
    Write-Host ""
    
    # Preguntar si quiere abrir el escritorio
    $open = Read-Host "¿Abrir carpeta del escritorio? (S/N)"
    if ($open -eq "S" -or $open -eq "s") {
        Start-Process "explorer.exe" -ArgumentList $desktopPath
    }
} catch {
    Write-Host "❌ Error creando acceso directo:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Crea el acceso directo manualmente:" -ForegroundColor Yellow
    Write-Host "   1. Click derecho en escritorio → Nuevo → Acceso directo" -ForegroundColor White
    Write-Host "   2. Ubicación: $scriptPath" -ForegroundColor White
    Write-Host "   3. Nombre: QA Nexora Comet" -ForegroundColor White
}

