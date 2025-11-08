@echo off
REM Script para crear acceso directo QA en el escritorio (Windows CMD)
REM Ejecutar: crear-acceso-directo-qa.bat

echo Creando acceso directo QA en el escritorio...
echo.

REM Obtener ruta del proyecto
set PROJECT_PATH=%~dp0
set SCRIPT_PATH=%PROJECT_PATH%qa-monitor.bat
set DESKTOP_PATH=%USERPROFILE%\Desktop
set SHORTCUT_NAME=QA Nexora Comet.lnk

REM Verificar que el script existe
if not exist "%SCRIPT_PATH%" (
    echo Error: No se encontro qa-monitor.bat
    echo    Ruta esperada: %SCRIPT_PATH%
    pause
    exit /b 1
)

echo Proyecto: %PROJECT_PATH%
echo Script: %SCRIPT_PATH%
echo Escritorio: %DESKTOP_PATH%
echo.

REM Crear acceso directo usando PowerShell
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_PATH%\%SHORTCUT_NAME%'); $Shortcut.TargetPath = '%SCRIPT_PATH%'; $Shortcut.WorkingDirectory = '%PROJECT_PATH%'; $Shortcut.Description = 'QA Monitor - Studio Nexora Comet'; $Shortcut.IconLocation = 'shell32.dll,23'; $Shortcut.Save()"

if %errorlevel% equ 0 (
    echo.
    echo Acceso directo creado exitosamente!
    echo    Ubicacion: %DESKTOP_PATH%\%SHORTCUT_NAME%
    echo.
    echo Proximos pasos:
    echo    1. Ve a tu escritorio
    echo    2. Busca 'QA Nexora Comet'
    echo    3. Doble click para ejecutar QA
    echo.
) else (
    echo.
    echo Error creando acceso directo.
    echo.
    echo Crea el acceso directo manualmente:
    echo    1. Click derecho en escritorio -^> Nuevo -^> Acceso directo
    echo    2. Ubicacion: %SCRIPT_PATH%
    echo    3. Nombre: QA Nexora Comet
    echo.
)

pause

