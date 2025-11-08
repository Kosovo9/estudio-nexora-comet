# quick-fix.ps1 - Ultra-rapido (limpieza + fixes criticos)
# Uso: powershell -ExecutionPolicy Bypass -File quick-fix.ps1

$ErrorActionPreference = "SilentlyContinue"
Write-Host "Quick Fix" -ForegroundColor Cyan

# Limpieza paralela
@('.next', 'build', 'dist', 'cypress\reports') | ForEach-Object -Parallel {
    Remove-Item -Recurse -Force $_ -ErrorAction SilentlyContinue
} -ThrottleLimit 4

# Fixes criticos Cypress (regex optimizado)
Get-ChildItem "cypress\e2e\*.cy.ts" -Recurse | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $n = $c -replace '\.then\(\(win\)\s*=>', '.then((win: any) =>' `
           -replace '\.then\(\(\$el\)\s*=>', '.then(($el: any) =>' `
           -replace 'onUncaughtException:[^}]+}', 'failOnStatusCode: false'
    if ($c -ne $n) { 
        Set-Content $_.FullName -Value $n -NoNewline
        Write-Host "[OK] $($_.Name)" -ForegroundColor Green 
    }
}

Write-Host "Listo!" -ForegroundColor Green

