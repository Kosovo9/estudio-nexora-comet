@echo off
REM QA Runner Mega Optimizado - Studio Nexora Comet (Windows)
REM Verifica todo el proyecto, ejecuta tests E2E, genera reporte y abre UI web final

echo ==========================================
echo QA MONITOR - STUDIO NEXORA COMET
echo ==========================================
echo.

REM 1. Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encontró package.json. Asegúrate de estar en la raíz del proyecto.
    pause
    exit /b 1
)

REM 2. Verificar dependencias instaladas
if not exist "node_modules" (
    echo ⚠️  node_modules no encontrado. Instalando dependencias...
    call npm install
)

REM 3. Ejecutar tests E2E completos
echo 📊 Iniciando revisión profunda de Studio Nexora Comet...
echo    Esto puede tardar varios minutos...
echo.
call npm run test:e2e:full
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Algunos tests fallaron. Revisa el output arriba.
    echo.
)
echo.

REM 4. Generar reporte HTML visual
echo 📄 Generando reporte HTML visual QA...
call npm run test:report
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Error generando reporte. Verifica que los tests se ejecutaron correctamente.
    echo.
)
echo.

REM 5. Verificar que el reporte existe y abrirlo
set REPORT_PATH=.\cypress\reports\html\mochawesome.html
if not exist "%REPORT_PATH%" (
    set REPORT_PATH=.\cypress\reports\mochawesome.html
)

if exist "%REPORT_PATH%" (
    echo ✅ Reporte generado exitosamente
    echo 📂 Ubicación: %REPORT_PATH%
    echo.
    echo 🌐 Abriendo reporte visual QA...
    start "" "%REPORT_PATH%"
) else (
    echo ⚠️  Reporte no encontrado en la ubicación esperada.
    echo    Busca en: .\cypress\reports\
)

echo.
echo ==========================================
echo REVISIÓN FINALIZADA
echo ==========================================
echo.
echo 📋 Próximos pasos:
echo    1. Revisa el reporte HTML para ver detalles de cada test
echo    2. Verifica que todos los botones y funciones estén correctos
echo    3. Si todo está bien, ejecuta: push-to-production.bat
echo    4. O manualmente: git add . ^&^& git commit -m "..." ^&^& git push origin main
echo.
pause

