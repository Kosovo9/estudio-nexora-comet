@echo off
REM Script para listar archivos del proyecto (Windows CMD)
REM Ejecutar: listar-proyecto.bat

echo Listando archivos del proyecto Studio Nexora Comet...
echo.

REM Limpiar archivo anterior
if exist solo_studio_nexora_comet.txt del solo_studio_nexora_comet.txt

REM Listar archivos JS
for /r %%f in (*.js) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

REM Listar archivos JSX
for /r %%f in (*.jsx) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

REM Listar archivos TSX
for /r %%f in (*.tsx) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

REM Listar archivos TS
for /r %%f in (*.ts) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

REM Listar archivos JSON
for /r %%f in (*.json) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

REM Listar archivos CSS
for /r %%f in (*.css) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

REM Listar archivos MD
for /r %%f in (*.md) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

REM Listar archivos HTML
for /r %%f in (*.html) do (
    echo %%f | findstr /v /i "node_modules .next build .git .pnpm dist coverage" >nul
    if !errorlevel! equ 0 echo %%f >> solo_studio_nexora_comet.txt
)

echo.
echo Archivos listados en: solo_studio_nexora_comet.txt
echo.
echo Mostrando contenido:
type solo_studio_nexora_comet.txt
pause

