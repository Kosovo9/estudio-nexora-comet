# PowerShell Script - Listar archivos del proyecto (excluyendo node_modules, .next, build, .git, etc.)
# Ejecutar: .\listar-proyecto.ps1

Write-Host "🔍 Listando archivos del proyecto Studio Nexora Comet..." -ForegroundColor Cyan
Write-Host ""

$excludePaths = @(
    'node_modules',
    '.next',
    'build',
    '.git',
    '.pnpm',
    'dist',
    'coverage',
    '.turbo'
)

$extensions = @('*.js', '*.jsx', '*.tsx', '*.ts', '*.json', '*.css', '*.md', '*.html')

$files = Get-ChildItem -Recurse -File -Include $extensions | Where-Object {
    $fullPath = $_.FullName
    $shouldExclude = $false
    
    foreach ($exclude in $excludePaths) {
        if ($fullPath -match "\\$exclude\\") {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
}

$relativeFiles = $files | ForEach-Object {
    $_.FullName.Replace((Get-Location).Path + '\', '.\')
}

$relativeFiles | Out-File -FilePath solo_studio_nexora_comet.txt -Encoding utf8

$count = ($relativeFiles | Measure-Object).Count
Write-Host "✅ Archivos encontrados: $count" -ForegroundColor Green
Write-Host "📄 Lista guardada en: solo_studio_nexora_comet.txt" -ForegroundColor Green
Write-Host ""
Write-Host "Primeros 50 archivos:" -ForegroundColor Yellow
Write-Host ""
$relativeFiles | Select-Object -First 50

