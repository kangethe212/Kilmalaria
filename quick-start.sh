#!/bin/bash

# CliMalaria Quick Start Script
# This script helps you get started quickly

echo "🏥 CliMalaria - Quick Start"
echo "=========================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Firebase configuration not found!"
    echo "📝 Please create frontend/.env with your Firebase config"
    echo "   You can copy from frontend/.env.example"
    echo ""
    echo "To continue, you need to:"
    echo "1. Create a Firebase project at https://console.firebase.google.com"
    echo "2. Enable Authentication (Email/Password, Google, Microsoft)"
    echo "3. Create a Firestore database"
    echo "4. Copy your config to frontend/.env"
    echo ""
    read -p "Have you configured Firebase? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please configure Firebase first. See SETUP_GUIDE.md for help."
        exit 1
    fi
fi

echo "🚀 Starting CliMalaria services..."
echo ""
echo "This will:"
echo "  - Build ML Service (Flask + RandomForest)"
echo "  - Build Rasa Service (Chatbot)"
echo "  - Build Frontend (React)"
echo "  - Train the ML model"
echo "  - Start all services"
echo ""
echo "This may take 5-10 minutes on first run..."
echo ""

# Build and start services
docker-compose up --build

echo ""
echo "✅ Services started!"
echo ""
echo "Access the application at:"
echo "  Frontend:   http://localhost:3000"
echo "  ML Service: http://localhost:8000"
echo "  Rasa:       http://localhost:5005"
echo ""
echo "To stop: Press Ctrl+C"
echo ""

