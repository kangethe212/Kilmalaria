@echo off
REM CliMalaria Quick Start Script for Windows
REM This script helps you get started quickly

echo.
echo ======================================
echo    CliMalaria - Quick Start
echo ======================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Check if .env exists
if not exist "frontend\.env" (
    echo WARNING: Firebase configuration not found!
    echo.
    echo Please create frontend\.env with your Firebase config
    echo You can copy from frontend\.env.example
    echo.
    echo To continue, you need to:
    echo 1. Create a Firebase project at https://console.firebase.google.com
    echo 2. Enable Authentication (Email/Password, Google, Microsoft^)
    echo 3. Create a Firestore database
    echo 4. Copy your config to frontend\.env
    echo.
    echo See SETUP_GUIDE.md for detailed instructions.
    echo.
    pause
    exit /b 1
)

echo [OK] Firebase configuration found
echo.
echo Starting CliMalaria services...
echo.
echo This will:
echo   - Build ML Service (Flask + RandomForest^)
echo   - Build Rasa Service (Chatbot^)
echo   - Build Frontend (React^)
echo   - Train the ML model
echo   - Start all services
echo.
echo This may take 5-10 minutes on first run...
echo.
pause

REM Build and start services
docker-compose up --build

echo.
echo ======================================
echo   Services started!
echo ======================================
echo.
echo Access the application at:
echo   Frontend:   http://localhost:3000
echo   ML Service: http://localhost:8000
echo   Rasa:       http://localhost:5005
echo.
pause

