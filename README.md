# CliMalaria - Intelligent Malaria Prediction System

## 🏥 Project Overview

CliMalaria is an intelligent web-based application designed to predict and analyze malaria cases across Kenyan counties using machine learning and conversational AI technologies. The system provides healthcare professionals, researchers, and the general public with accessible, data-driven insights into malaria prevalence patterns.

## 🎯 Key Features

- **ML-Powered Predictions**: RandomForest regression models forecast malaria cases up to 12 months ahead
- **Conversational AI**: Natural language chatbot powered by Rasa for intuitive interactions
- **Regional Analysis**: County-specific predictions across 18 Kenyan counties
- **User Authentication**: Secure login with Firebase (Email/Password, Google OAuth, Microsoft OAuth)
- **Conversation History**: Persistent chat storage with Firestore
- **Modern UI**: Responsive React interface with Tailwind CSS

## 🏗️ Technical Architecture

### Microservices Architecture (Docker)

1. **ML Service (Flask)** - Port 8000
   - RandomForest prediction models
   - Historical data analysis
   - County statistics API
   - Endpoints: `/counties`, `/county_stats`, `/predict_regional`

2. **Rasa Server** - Port 5005
   - NLU with DIET architecture
   - Intent classification & entity extraction
   - Dialogue management

3. **Rasa Actions Server** - Port 5055
   - Custom actions for ML integration
   - Response formatting

4. **React Frontend** - Port 3000
   - Vite build system
   - Zustand state management
   - Tailwind CSS styling
   - Firebase integration

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)
- Firebase project (for authentication)

### Setup Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password, Google, Microsoft)
3. Create a Firestore database
4. Copy your Firebase config to `frontend/.env`

### Running with Docker

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# ML Service: http://localhost:8000
# Rasa Server: http://localhost:5005
```

### Local Development

#### ML Service
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python train_model.py  # Train the model first
python app.py
```

#### Rasa Service
```bash
cd rasa-service
pip install -r requirements.txt
rasa train
rasa run --enable-api --cors "*"
# In another terminal:
rasa run actions
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Data & ML Model

The system uses **RandomForest regression** trained on:
- **3 years** of historical malaria data (2020-2023)
- **18 Kenyan counties** with varying risk profiles
- **Environmental features**: rainfall (mm), temperature (°C), humidity (%)
- **Temporal patterns**: lagged features (1, 2, 3, 6, 12 months)
- **100 decision trees**, max depth 20

### Counties Covered
Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Kakamega, Bungoma, Kisii, Nyeri, Meru, Machakos, Kilifi, Kwale, Turkana, Baringo, Homa Bay, Migori, Siaya

## 🔒 Security

- Firebase Authentication with OAuth support
- Firestore security rules for user data isolation
- Environment variable configuration
- CORS protection on API endpoints
- User-specific conversation history

## 📁 Project Structure

```
CliMalaria/
├── ml-service/              # Flask ML prediction engine
│   ├── app.py              # Main Flask application
│   ├── train_model.py      # Model training script
│   ├── generate_data.py    # Synthetic data generation
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── rasa-service/           # Rasa chatbot
│   ├── data/               # NLU training data
│   ├── actions/            # Custom actions
│   ├── config.yml          # Rasa configuration
│   ├── domain.yml          # Rasa domain
│   ├── credentials.yml     # API credentials
│   └── endpoints.yml       # Service endpoints
├── frontend/               # React web app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Service orchestration
└── README.md
```

## 🎓 Learning Guide

This project demonstrates:
- **Machine Learning**: Supervised learning with RandomForest
- **Feature Engineering**: Temporal & environmental features
- **NLP**: Intent classification, entity extraction
- **Microservices**: Containerized architecture
- **Modern Frontend**: React hooks, state management
- **Cloud Services**: Firebase Auth & Firestore
- **API Design**: RESTful endpoints

## 📝 License

This project is for educational and public health research purposes.

## 👥 Contributing

This is a research project aimed at democratizing access to epidemiological insights.

---

**Built with ❤️ for public health innovation**

