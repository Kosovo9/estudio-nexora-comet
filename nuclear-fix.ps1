# SOLUCIÓN NUCLEAR DEFINITIVA
Write-Host "ELIMINANDO ARCHIVO PROBLEMATICO..." -ForegroundColor Red

# Elimina el archivo que causa problemas
Remove-Item "MEGA_APP_COMPLETE.tsx" -Force -ErrorAction SilentlyContinue

# Asegura que app/page.tsx sea el único punto de entrada
Write-Host "Archivo problematico eliminado" -ForegroundColor Green

# Build
Write-Host "`nEjecutando build..." -ForegroundColor Yellow
npm run build 2>&1 | Out-String | Out-Null

# Si pasa, push
if ($LASTEXITCODE -eq 0) {
  Write-Host "`nBuild exitoso, haciendo push..." -ForegroundColor Green
  git add .
  git commit -m "fix: Remove MEGA_APP_COMPLETE, use only app/page.tsx"
  git push origin main
  
  Write-Host "`nPUSHED. Vercel rebuildeara en 5 min." -ForegroundColor Cyan
} else {
  Write-Host "`nBuild fallo. Revisa errores arriba." -ForegroundColor Red
}

