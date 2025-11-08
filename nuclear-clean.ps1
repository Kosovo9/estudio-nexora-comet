# Nuclear clean + force push
Write-Host "NUCLEAR CLEAN..." -ForegroundColor Red

# Elimina TODO
@('.next', 'build', '.turbo', '.vercel', 'node_modules/.cache', 'dist') | ForEach-Object {
  if (Test-Path $_) { 
    Remove-Item -Recurse -Force $_ -ErrorAction SilentlyContinue
    Write-Host "  [DELETED] $_" -ForegroundColor Yellow
  }
}

# Limpia npm cache
Write-Host "`nLimpiando npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Reinstala dependencias
Write-Host "Reinstalando dependencias..." -ForegroundColor Yellow
npm ci --legacy-peer-deps

# Build FORZADO
Write-Host "`nBUILD..." -ForegroundColor Yellow
$output = npm run build 2>&1 | Out-String

# Si pasó, push FORZADO
if ($output -match "Compiled successfully") {
  Write-Host "`nBuild OK, pushing..." -ForegroundColor Green
  git add .
  git commit -m "nuclear: force rebuild - clear all caches"
  git push origin main --force-with-lease
  
  Write-Host "`nPushed. Vercel rebuildeara en ~5 minutos sin cache." -ForegroundColor Cyan
} else {
  Write-Host "`nBuild aun tiene error. Muestra el output arriba." -ForegroundColor Red
  $output | Select-String "error|Type error|Failed" -Context 2 | Select-Object -First 10
}

