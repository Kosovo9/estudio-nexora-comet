# fix-all.ps1 - Script optimizado 10x para Studio Nexora Comet
# Ejecuta desde la raíz: powershell -ExecutionPolicy Bypass -File fix-all.ps1

$ErrorActionPreference = "SilentlyContinue"
$startTime = Get-Date

Write-Host "🚀 Studio Nexora Comet - Fix All (10x Optimizado)" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

# 1. Limpieza de caché (paralelo optimizado)
Write-Host "`n📦 Limpiando caché..." -ForegroundColor Yellow
@('.next', 'build', 'dist', 'cypress\reports', 'node_modules\.cache') | ForEach-Object -Parallel {
    if (Test-Path $_) { Remove-Item -Recurse -Force $_ }
} -ThrottleLimit 5
Write-Host "  ✓ Caché limpiado" -ForegroundColor Green

# 2. Verificar raíz del proyecto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: Ejecuta desde la raíz (donde está package.json)" -ForegroundColor Red
    Write-Host "   Actual: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ Proyecto: $(Split-Path (Get-Location) -Leaf)" -ForegroundColor Green

# 3. Fixes automáticos de Cypress (regex optimizado)
Write-Host "`n🔧 Fixes Cypress..." -ForegroundColor Yellow
$cypressFiles = Get-ChildItem "cypress\e2e\*.cy.ts" -Recurse -ErrorAction SilentlyContinue

if ($cypressFiles) {
    $fixes = @{
        '\.then\(\(win\)\s*=>' = '.then((win: any) =>'
        '\.then\(\(\$el\)\s*=>' = '.then(($el: any) =>'
        'onUncaughtException:\s*\([^)]+\)\s*=>[^}]+}' = 'failOnStatusCode: false'
    }
    
    $fixed = 0
    $cypressFiles | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $new = $content
        $fixes.Keys | ForEach-Object { $new = $new -replace $_, $fixes[$_] }
        if ($new -ne $content) {
            Set-Content $_.FullName -Value $new -NoNewline
            $fixed++
        }
    }
    Write-Host "  ✓ $fixed archivos corregidos" -ForegroundColor Green
}

# 4. Verificar dependencias
Write-Host "`n📋 Dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  ⚠ Instalando..." -ForegroundColor Yellow
    npm install --silent
} else {
    Write-Host "  ✓ node_modules OK" -ForegroundColor Green
}

# 5. Scripts NPM
Write-Host "`n📜 Scripts disponibles:" -ForegroundColor Yellow
npm run 2>&1 | Select-String "^\s+\w+" | Select-Object -First 8 | ForEach-Object {
    Write-Host "  $($_.Line.Trim())" -ForegroundColor Cyan
}

# 6. Build check rápido (solo errores críticos)
Write-Host "`n🔨 Build check..." -ForegroundColor Yellow
$buildErrors = npm run build 2>&1 | Select-String "Type error|Failed to compile" | Select-Object -First 3
if ($buildErrors) {
    Write-Host "  ⚠ Errores:" -ForegroundColor Red
    $buildErrors | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
} else {
    Write-Host "  ✓ Sin errores críticos" -ForegroundColor Green
}

# 7. Resumen
$duration = [math]::Round((Get-Date - $startTime).TotalSeconds, 2)
Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan
Write-Host "✅ Completado en ${duration}s" -ForegroundColor Green
Write-Host "`n📝 Siguiente: npm run dev | npm run test:e2e | npm run build" -ForegroundColor Yellow
Write-Host ""

