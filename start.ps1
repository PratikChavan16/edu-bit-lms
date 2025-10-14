# Sai LMS Fee Management System - PowerShell Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Sai LMS Fee Management System" -ForegroundColor Green
Write-Host " Starting Backend and Frontend Servers" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set execution policy for this session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start backend server in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend server in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Set-Location frontend; npm start"

Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host "✅ Backend: Check the first PowerShell window" -ForegroundColor Green
Write-Host "✅ Frontend: Check the second PowerShell window" -ForegroundColor Green
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Cyan
Write-Host "  Admin - Username: admin, Password: admin123" -ForegroundColor White
Write-Host "  Accountant - Username: accountant, Password: accountant123" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window (servers will continue running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
