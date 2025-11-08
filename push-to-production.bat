@echo off
REM PUSH TO PRODUCTION - Studio Nexora Comet (Windows)
REM Ejecuta revisión completa, tests y push a GitHub

echo ==========================================
echo PUSH TO PRODUCTION - STUDIO NEXORA COMET
echo ==========================================
echo.

REM 1. Verificar rama
for /f "tokens=2" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
if "%CURRENT_BRANCH%"=="main" (
    echo ✅ Estás en la rama main
) else (
    echo ⚠️  Estás en la rama: %CURRENT_BRANCH%
    set /p CONTINUE="¿Continuar de todas formas? (y/n): "
    if /i not "%CONTINUE%"=="y" exit /b 1
)
echo.

REM 2. Verificar cambios
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo 📝 Cambios detectados:
    git status --short
    echo.
    set /p ADD_CHANGES="¿Agregar todos los cambios? (y/n): "
    if /i "%ADD_CHANGES%"=="y" (
        git add .
    ) else (
        echo ❌ Hay cambios sin agregar. Abortando.
        exit /b 1
    )
)
echo.

REM 3. Ejecutar revisión rápida
echo 🔍 Ejecutando revisión rápida...
call npm run lint
echo.

REM 4. Verificar build
echo 🏗️  Verificando build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build falló. Corrige los errores antes de hacer push.
    pause
    exit /b 1
)
echo.

REM 5. Tests opcionales
set /p RUN_TESTS="¿Ejecutar tests E2E completos? (puede tardar varios minutos) (y/n): "
if /i "%RUN_TESTS%"=="y" (
    echo 🧪 Ejecutando tests E2E...
    call npm run test:e2e:full
    call npm run test:report
)
echo.

REM 6. Solicitar mensaje de commit
echo.
echo 📝 Ingresa el mensaje de commit:
set /p COMMIT_MESSAGE="> "
if "%COMMIT_MESSAGE%"=="" (
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do set DATE=%%c-%%a-%%b
    set COMMIT_MESSAGE=feat: Studio Nexora Comet updates - %DATE%
    echo ⚠️  Usando mensaje por defecto: %COMMIT_MESSAGE%
)
echo.

REM 7. Commit
echo 💾 Haciendo commit...
git commit -m "%COMMIT_MESSAGE%"
if %errorlevel% neq 0 (
    echo ❌ Error al hacer commit
    pause
    exit /b 1
)
echo.

REM 8. Push
echo 📤 Haciendo push a origin main...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Error al hacer push
    pause
    exit /b 1
)
echo.

echo ✅ Push completado exitosamente!
echo.
echo 🌐 Tu sitio se desplegará automáticamente en Vercel
echo    Revisa: https://studio-nexora.com
echo.
echo 📊 Para verificar el deploy:
echo    1. Ve a https://vercel.com/dashboard
echo    2. Revisa el último deployment
echo    3. Verifica que el build fue exitoso
echo.
pause

