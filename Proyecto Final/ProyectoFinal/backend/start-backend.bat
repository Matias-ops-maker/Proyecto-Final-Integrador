@echo off
cd /d "%~dp0"
echo Directorio actual: %CD%
echo Verificando package.json del backend...
if exist package.json (
    echo package.json encontrado
    npm start
) else (
    echo ERROR: package.json no encontrado en backend
    dir
)
pause