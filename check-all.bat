@echo off
REM REVISIÓN INTEGRAL DE STUDIO NEXORA COMET (Windows)
REM Revisa carpetas, subcarpetas, archivos, errores, sintaxis y QA

echo ==========================================
echo REVISIÓN INTEGRAL STUDIO NEXORA COMET
echo ==========================================
echo.

echo 📁 1. Verificando estructura de carpetas...
if exist "app" (
    echo ✅ Directorio app existe
) else (
    echo ❌ Directorio app NO existe
)

if exist "components" (
    echo ✅ Directorio components existe
) else (
    echo ❌ Directorio components NO existe
)

if exist "lib" (
    echo ✅ Directorio lib existe
) else (
    echo ❌ Directorio lib NO existe
)

if exist "hooks" (
    echo ✅ Directorio hooks existe
) else (
    echo ❌ Directorio hooks NO existe
)

if exist "cypress" (
    echo ✅ Directorio cypress existe
) else (
    echo ❌ Directorio cypress NO existe
)

if exist "scripts" (
    echo ✅ Directorio scripts existe
) else (
    echo ❌ Directorio scripts NO existe
)
echo.

echo 📦 2. Verificando dependencias...
if exist "package.json" (
    echo ✅ package.json encontrado
    call npm ls --depth=1
) else (
    echo ❌ package.json NO encontrado
)
echo.

echo 🔒 3. Verificando seguridad de dependencias...
call npm audit --audit-level=moderate
echo.

echo 📝 4. Verificando archivos de configuración...
if exist "tsconfig.json" (
    echo ✅ tsconfig.json existe
) else (
    echo ⚠️  tsconfig.json NO encontrado
)

if exist "next.config.js" (
    echo ✅ next.config.js existe
) else (
    echo ⚠️  next.config.js NO encontrado
)

if exist "tailwind.config.js" (
    echo ✅ tailwind.config.js existe
) else (
    echo ⚠️  tailwind.config.js NO encontrado
)

if exist "cypress.config.ts" (
    echo ✅ cypress.config.ts existe
) else (
    echo ⚠️  cypress.config.ts NO encontrado
)
echo.

echo 🌐 5. Verificando variables de entorno...
if exist ".env.local" (
    echo ✅ .env.local encontrado
    findstr /C:"SUPABASE" .env.local >nul && echo   ✅ SUPABASE configurado || echo   ⚠️  SUPABASE no encontrado
    findstr /C:"CLERK" .env.local >nul && echo   ✅ CLERK configurado || echo   ⚠️  CLERK no encontrado
    findstr /C:"STRIPE" .env.local >nul && echo   ✅ STRIPE configurado || echo   ⚠️  STRIPE no encontrado
    findstr /C:"GOOGLE" .env.local >nul && echo   ✅ GOOGLE AI configurado || echo   ⚠️  GOOGLE AI no encontrado
) else (
    echo ⚠️  .env.local NO encontrado (crear con las claves necesarias)
)
echo.

echo 🔧 6. Verificando TypeScript...
echo   Ejecutando TypeScript check...
call npx tsc --noEmit --pretty --skipLibCheck
echo.

echo 🧹 7. Verificando ESLint...
echo   Ejecutando ESLint...
call npm run lint
echo.

echo 🏗️  8. Verificando build...
echo   Ejecutando build de Next.js...
call npm run build
echo.

echo 🧪 9. Verificando Cypress...
if exist "cypress" (
    echo ✅ Directorio cypress existe
    if exist "cypress.config.ts" (
        echo ✅ Configuración de Cypress encontrada
    ) else (
        echo ⚠️  Configuración de Cypress no encontrada
    )
) else (
    echo ❌ Directorio cypress NO existe
)
echo.

echo 📊 10. Verificando estructura de componentes críticos...
if exist "components\AIGeneration.tsx" (
    echo ✅ components\AIGeneration.tsx existe
) else (
    echo ❌ components\AIGeneration.tsx NO existe
)

if exist "components\MegaUI.tsx" (
    echo ✅ components\MegaUI.tsx existe
) else (
    echo ❌ components\MegaUI.tsx NO existe
)

if exist "components\CopilotWidget.tsx" (
    echo ✅ components\CopilotWidget.tsx existe
) else (
    echo ❌ components\CopilotWidget.tsx NO existe
)

if exist "app\layout.tsx" (
    echo ✅ app\layout.tsx existe
) else (
    echo ❌ app\layout.tsx NO existe
)
echo.

echo 📋 11. Resumen de archivos importantes...
for /f %%i in ('dir /s /b components\*.tsx components\*.ts 2^>nul ^| find /c /v ""') do set COMPONENTS=%%i
echo   Componentes: %COMPONENTS%

for /f %%i in ('dir /s /b app\api\**\route.ts 2^>nul ^| find /c /v ""') do set API_ROUTES=%%i
echo   API Routes: %API_ROUTES%

for /f %%i in ('dir /s /b cypress\e2e\*.cy.ts 2^>nul ^| find /c /v ""') do set TESTS=%%i
echo   Tests Cypress: %TESTS%
echo.

echo 🎯 12. Verificando shortcuts de QA...
if exist "run-qa.bat" (
    echo ✅ run-qa.bat existe
) else (
    echo ⚠️  run-qa.bat NO existe
)
echo.

echo ==========================================
echo REVISIÓN COMPLETA
echo ==========================================
echo.
echo 📝 Próximos pasos:
echo   1. Revisar errores/warnings arriba
echo   2. Ejecutar: npm run test:e2e:full
echo   3. Ejecutar: npm run test:report
echo   4. Si todo está bien: git add . ^&^& git commit -m "..." ^&^& git push origin main
echo.

pause

