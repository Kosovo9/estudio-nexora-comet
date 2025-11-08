# Fixes automáticos para errores detectados
$files = @(
  "cypress/e2e/seo-accessibility.cy.ts",
  "cypress/e2e/mobile-responsive.cy.ts",
  "components/PaymentForm.tsx"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "Corrigiendo: $file" -ForegroundColor Yellow
    
    $content = Get-Content $file -Raw
    
    # Fix: checkA11y
    $content = $content -replace 'cy\.checkA11y\(null,', 'cy.checkA11y(undefined,'
    
    # Fix: tipado HTML (más específico)
    $content = $content -replace 'const btn2 = nextBtn\[0\]', 'const btn2 = (nextBtn[0] as any) as HTMLElement'
    $content = $content -replace 'const btn1 = \(\$btn\[0\]\) as any', 'const btn1 = ($btn[0] as any) as HTMLElement'
    
    # Fix: import type
    $content = $content -replace "import \{ type Language, getTexts \}", "import { getTexts, type Language }"
    
    Set-Content $file -Value $content -NoNewline
    Write-Host "[OK] $file corregido" -ForegroundColor Green
  } else {
    Write-Host "[SKIP] $file no encontrado" -ForegroundColor Gray
  }
}

Write-Host "`nTodos los archivos procesados. Ejecuta: npm run build" -ForegroundColor Cyan

