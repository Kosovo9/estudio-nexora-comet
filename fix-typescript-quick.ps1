# Ultra-rapido: Solo elimina todos los "type" keywords innecesarios de imports
Write-Host "Fix rapido TypeScript..." -ForegroundColor Cyan

Get-ChildItem -Path . -Recurse -Include "*.tsx", "*.ts" -Exclude node_modules | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $n = $c `
        -replace 'import \{ type (\w+), (\w+) \}', 'import { $2, type $1 }' `
        -replace 'import \{ type (\w+) \}', 'import { type $1 }'
    
    if ($c -ne $n) { 
        Set-Content $_.FullName -Value $n -NoNewline
        Write-Host "[OK] $($_.Name)" -ForegroundColor Green 
    }
}

Write-Host "Listo! Ejecutando build..." -ForegroundColor Green
npm run build 2>&1 | Select-Object -Last 3

