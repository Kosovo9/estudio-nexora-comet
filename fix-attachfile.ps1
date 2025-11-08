# Reemplaza attachFile por selectFile en todos los tests
Write-Host "Corrigiendo attachFile -> selectFile..." -ForegroundColor Yellow

# Fix en commands.ts
if (Test-Path "cypress/support/commands.ts") {
    $content = Get-Content "cypress/support/commands.ts" -Raw
    $newContent = $content -replace '\.attachFile\(', '.selectFile('
    
    if ($content -ne $newContent) {
        Set-Content "cypress/support/commands.ts" -Value $newContent -NoNewline
        Write-Host "[OK] commands.ts corregido" -ForegroundColor Green
    }
}

# Fix en todos los archivos .cy.ts
Get-ChildItem -Path "cypress/e2e" -Include "*.cy.ts" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace '\.attachFile\(', '.selectFile('
    
    if ($content -ne $newContent) {
        Set-Content $_.FullName -Value $newContent -NoNewline
        Write-Host "[OK] $($_.Name) corregido" -ForegroundColor Green
    }
}

Write-Host "`nTodos los attachFile reemplazados por selectFile" -ForegroundColor Cyan
Write-Host "Ejecutando build..." -ForegroundColor Yellow

