@echo off
cd /d "%~dp0"
echo Directorio actual: %CD%
echo Verificando package.json...
if exist package.json (
    echo package.json encontrado
    npm run dev
) else (
    echo ERROR: package.json no encontrado
    dir
)
pause