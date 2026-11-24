@echo off
echo Starting HWMS Django Backend on port 8000...
cd /d %~dp0
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
pause
