@echo off
echo ========================================================
echo   Starting Handloom Weaver Management System (HWMS)
echo   Backend: Django REST Framework (Port 8000)
echo   Frontend: React + Vite (Port 5173)
echo ========================================================

start cmd /k "cd /d %~dp0backend && (if exist .venv\Scripts\activate.bat call .venv\Scripts\activate.bat) && python manage.py runserver 0.0.0.0:8000"
timeout /t 2 >nul
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Servers are launching:
echo - Frontend: http://localhost:5173/
echo - Backend API: http://localhost:8000/api/
echo - Django Admin: http://localhost:8000/admin/
echo ========================================================
