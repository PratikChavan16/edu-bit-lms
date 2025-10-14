@echo off
echo ========================================
echo  Sai LMS Fee Management System
echo  Starting Backend and Frontend Servers
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Starting servers...
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

:: Start both servers
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting...
echo ✅ Backend: Check the "Backend Server" window
echo ✅ Frontend: Check the "Frontend Server" window
echo.
echo Login credentials:
echo   Admin - Username: admin, Password: admin123
echo   Accountant - Username: accountant, Password: accountant123
echo.
pause
