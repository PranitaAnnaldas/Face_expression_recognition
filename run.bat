@echo off
echo ========================================
echo   Facial Expression Recognition
echo ========================================
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Run the application
echo Starting application...
echo.
echo ========================================
echo   Server will start at:
echo   http://localhost:5000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
