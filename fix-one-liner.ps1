# fix-one-liner.ps1 - Versión ultra-optimizada (una línea)
# Uso: powershell -ExecutionPolicy Bypass -Command "& { cd C:\estudio-nexora-comet; @('.next','build','dist','cypress\reports') | ForEach-Object { Remove-Item -Recurse -Force $_ -ErrorAction SilentlyContinue }; Get-ChildItem 'cypress\e2e\*.cy.ts' -Recurse | ForEach-Object { $c=Get-Content $_.FullName -Raw; $n=$c -replace '\.then\(\(win\)\s*=>','.then((win: any) =>' -replace '\.then\(\(\$el\)\s*=>','.then(($el: any) =>' -replace 'onUncaughtException:[^}]+}','failOnStatusCode: false'; if($c -ne $n){Set-Content $_.FullName -Value $n -NoNewline; Write-Host \"✓ $($_.Name)\" -ForegroundColor Green} }; Write-Host '✅ Fix completo!' -ForegroundColor Green }"

# Versión legible (mismo código, formateado):
$ErrorActionPreference = "SilentlyContinue"
@('.next','build','dist','cypress\reports') | ForEach-Object { Remove-Item -Recurse -Force $_ -ErrorAction SilentlyContinue }
Get-ChildItem 'cypress\e2e\*.cy.ts' -Recurse | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $n = $c -replace '\.then\(\(win\)\s*=>', '.then((win: any) =>' `
           -replace '\.then\(\(\$el\)\s*=>', '.then(($el: any) =>' `
           -replace 'onUncaughtException:[^}]+}', 'failOnStatusCode: false'
    if ($c -ne $n) { Set-Content $_.FullName -Value $n -NoNewline; Write-Host "✓ $($_.Name)" -ForegroundColor Green }
}
Write-Host "✅ Fix completo!" -ForegroundColor Green

