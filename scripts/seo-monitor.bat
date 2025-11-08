@echo off
REM SEO Monitor Automático - Studio Nexora Comet (Windows)
REM Ejecutar: scripts\seo-monitor.bat

echo ==========================================
echo SEO MONITOR AUTOMATICO
echo ==========================================
echo.

set DATE=%date:~-4,4%-%date:~-7,2%-%date:~-10,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set DATE=%DATE: =0%
set REPORT_DIR=.\seo-reports
set REPORT_FILE=%REPORT_DIR%\seo-report-%DATE%.html

REM Crear directorio si no existe
if not exist "%REPORT_DIR%" mkdir "%REPORT_DIR%"

echo Generando reporte SEO con Lighthouse...
echo    URL: https://studio-nexora.com
echo    Fecha: %date% %time%
echo.

REM Ejecutar Lighthouse
call npx lighthouse https://studio-nexora.com --output html --output-path "%REPORT_FILE%" --chrome-flags="--headless" --only-categories=seo,accessibility,performance --quiet

if %errorlevel% equ 0 (
    echo.
    echo Reporte generado exitosamente!
    echo Ubicacion: %REPORT_FILE%
    echo.
    echo Abriendo reporte...
    start "" "%REPORT_FILE%"
    echo.
    echo Revision SEO global lista
    echo.
    echo Proximos pasos:
    echo    1. Revisa el reporte HTML generado
    echo    2. Corrige cualquier problema encontrado
    echo    3. Compara con reportes anteriores
    echo.
) else (
    echo.
    echo Error generando reporte SEO
    echo    Verifica que Lighthouse este instalado: npm install -g lighthouse
    echo.
    exit /b 1
)

pause

