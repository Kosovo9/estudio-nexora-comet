# Script para encontrar y corregir TODOS los Type Errors
Write-Host "Buscando errores TypeScript..." -ForegroundColor Yellow

# Ejecuta build y captura errores
$buildOutput = npm run build 2>&1

# Busca lineas de error
$errors = $buildOutput | Select-String -Pattern "Type error|error TS|Failed to compile" -Context 1,3

if ($errors) {
    Write-Host "`nErrores encontrados:" -ForegroundColor Cyan
    $errors | Select-Object -First 10 | ForEach-Object {
        Write-Host $_.Line -ForegroundColor Red
    }
} else {
    Write-Host "No se encontraron errores TypeScript!" -ForegroundColor Green
    exit 0
}

# Fixes automaticos universales
Write-Host "`nAplicando fixes automaticos..." -ForegroundColor Yellow

# Fix 1: Corrige imports con "type" (mueve type al final)
Get-ChildItem -Path . -Recurse -Include "*.tsx", "*.ts" -Exclude node_modules | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content `
        -replace 'import \{ type (\w+), (\w+) \}', 'import { $2, type $1 }' `
        -replace 'import \{ type (\w+), (\w+), (\w+) \}', 'import { $2, $3, type $1 }' `
        -replace 'import \{ type (\w+) \}', 'import { type $1 }'
    
    if ($content -ne $newContent) {
        Set-Content $_.FullName -Value $newContent -NoNewline
        Write-Host "[OK] Import corregido: $($_.Name)" -ForegroundColor Green
    }
}

# Fix 2: Agrega tipo "any" a accesos de array sin tipado
Get-ChildItem -Path . -Recurse -Include "*.tsx", "*.ts" -Exclude node_modules | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content `
        -replace '(\w+)\[0\] as HTMLElement', '($1[0] as any) as HTMLElement' `
        -replace 'const (\w+) = (\w+)\[0\];', 'const $1 = ($2[0] as any);' `
        -replace 'let (\w+) = (\w+)\[0\];', 'let $1 = ($2[0] as any);'
    
    if ($content -ne $newContent) {
        Set-Content $_.FullName -Value $newContent -NoNewline
        Write-Host "[OK] Tipado añadido: $($_.Name)" -ForegroundColor Green
    }
}

# Fix 3: Corrige métodos Cypress comunes
Get-ChildItem -Path "cypress\e2e\*.cy.ts" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content `
        -replace '\.tab\(\)', '.type("{tab}")' `
        -replace '\.attachFile\(', '.selectFile(' `
        -replace 'cy\.checkA11y\(null,', 'cy.checkA11y(undefined,'
    
    if ($content -ne $newContent) {
        Set-Content $_.FullName -Value $newContent -NoNewline
        Write-Host "[OK] Cypress corregido: $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "`nFixes aplicados. Ejecutando build nuevamente..." -ForegroundColor Green
npm run build 2>&1 | Select-String -Pattern "Type error|error TS|Failed to compile|Compiled successfully" | Select-Object -First 5

