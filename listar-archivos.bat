@echo off
REM Script para listar todos los archivos del proyecto (Windows CMD)
echo Listando archivos del proyecto...
dir /S /B *.js > todos_los_elementos.txt 2>nul
dir /S /B *.jsx >> todos_los_elementos.txt 2>nul
dir /S /B *.tsx >> todos_los_elementos.txt 2>nul
dir /S /B *.json >> todos_los_elementos.txt 2>nul
dir /S /B *.md >> todos_los_elementos.txt 2>nul
dir /S /B *.ts >> todos_los_elementos.txt 2>nul
dir /S /B *.html >> todos_los_elementos.txt 2>nul
dir /S /B *.css >> todos_los_elementos.txt 2>nul
echo.
echo Archivos listados en: todos_los_elementos.txt
echo.
echo Mostrando primeros 30 archivos:
echo.
type todos_los_elementos.txt | more
pause

