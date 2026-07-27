@echo off
echo ===================================================
echo   RiftCoach AI - GitHub Sync & Deployment Helper
echo ===================================================

git status
echo.
set /p commit_msg="Ingresa el mensaje del commit: "
if "%commit_msg%"=="" set commit_msg="Update RiftCoach AI web application"

echo.
echo Guardando e iterando en Git...
git add .
git commit -m "%commit_msg%"

echo.
echo Presiona cualquier tecla para enviar a GitHub (git push origin main)...
pause
git push origin main

echo.
echo ===================================================
echo   Sync completado con exito.
echo ===================================================
pause
