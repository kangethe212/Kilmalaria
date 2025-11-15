# CliMalaria Setup Guide

Complete step-by-step guide to set up and run the CliMalaria system.

## Prerequisites

### Required Software
- **Docker** & **Docker Compose** (recommended)
- **Node.js** 18+ (for local frontend development)
- **Python** 3.9+ (for local ML/Rasa development)
- **Git** (for version control)

### Accounts Needed
- **Firebase** account (for authentication & database)

## Quick Start with Docker (Recommended)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CliMalaria
```

### 2. Configure Firebase

#### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Enter project name: "CliMalaria"
4. Follow the wizard (disable Google Analytics if not needed)

#### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable sign-in methods:
   - Email/Password
   - Google
   - Microsoft (optional)

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create Database"
3. Choose "Start in test mode" (we'll add rules later)
4. Select your region (closest to your users)

#### Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>) to add web app
4. Register app with nickname "CliMalaria Web"
5. Copy the config object

#### Configure Frontend
1. Copy `frontend/.env.example` to `frontend/.env`
2. Fill in Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_RASA_URL=http://localhost:5005
VITE_ML_SERVICE_URL=http://localhost:8000
```

#### Set Firestore Security Rules
1. Go to **Firestore Database** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chats - users can only access their own chats
    match /chats/{chatId} {
      allow read, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      
      // Messages within chats
      match /messages/{messageId} {
        allow read, create: if request.auth != null;
      }
    }
    
    // Contact form submissions
    match /contacts/{contactId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### 3. Build and Run with Docker Compose

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up
```

This will start:
- ML Service on http://localhost:8000
- Rasa Server on http://localhost:5005
- Rasa Actions on http://localhost:5055
- Frontend on http://localhost:3000

### 4. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the CliMalaria landing page!

## Local Development Setup

For development, you may want to run services individually:

### ML Service

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate data and train model
python generate_data.py
python train_model.py

# Run service
python app.py
```

ML Service: http://localhost:8000

### Rasa Service

```bash
cd rasa-service

# Install Rasa
pip install -r requirements.txt

# Train model
rasa train

# Terminal 1: Run Rasa server
rasa run --enable-api --cors "*"

# Terminal 2: Run actions server
rasa run actions
```

Rasa Server: http://localhost:5005

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (see Firebase config above)
cp .env.example .env
# Edit .env with your Firebase config

# Run development server
npm run dev
```

Frontend: http://localhost:3000

## Testing the System

### 1. Test ML Service

```bash
# Get counties
curl http://localhost:8000/counties

# Get stats
curl "http://localhost:8000/county_stats?county=Nairobi"

# Get prediction
curl -X POST http://localhost:8000/predict_regional \
  -H "Content-Type: application/json" \
  -d '{"county":"Nairobi","months_ahead":6}'
```

### 2. Test Rasa

```bash
# Test chatbot
curl -X POST http://localhost:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{"sender":"test","message":"Hello"}'
```

### 3. Test Frontend

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign In"
3. Create an account or sign in
4. Click "New Chat"
5. Try queries:
   - "Hello"
   - "List all counties"
   - "Predict malaria in Nairobi for 6 months"
   - "What are malaria symptoms?"

## Troubleshooting

### Docker Issues

**Error: Port already in use**
```bash
# Find and kill process using port 3000 (example)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

**Error: Cannot connect to Docker daemon**
- Ensure Docker Desktop is running
- Check Docker settings

### Frontend Issues

**Firebase auth not working**
- Verify .env file exists and has correct values
- Check Firebase console that auth methods are enabled
- Check browser console for errors

**Chat not responding**
- Ensure Rasa server is running (check http://localhost:5005)
- Check browser console for CORS errors
- Verify VITE_RASA_URL in .env

### ML Service Issues

**Model not found**
- Run `python generate_data.py` first
- Then run `python train_model.py`
- Check that `models/` directory was created

### Rasa Issues

**Actions not working**
- Ensure actions server is running on port 5055
- Check ML_SERVICE_URL environment variable
- Verify ML service is accessible

**Low accuracy**
- Retrain with `rasa train`
- Check that training data loaded correctly

## Production Deployment

### Environment Variables

For production, update:

**Frontend (.env)**
```env
VITE_RASA_URL=https://your-rasa-api.com
VITE_ML_SERVICE_URL=https://your-ml-api.com
```

**Docker Compose**
- Add proper volume mounts for persistence
- Use production-ready databases for Rasa tracker
- Set up HTTPS/SSL certificates
- Configure proper logging

### Security Checklist

- [ ] Change Firestore rules from test mode to production
- [ ] Enable Firebase App Check
- [ ] Set up proper CORS policies
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### Scaling

- Use managed services (Cloud Run, AWS ECS, etc.)
- Set up load balancing
- Configure auto-scaling
- Use CDN for frontend
- Optimize Docker images
- Set up caching layers

## Additional Resources

- [Rasa Documentation](https://rasa.com/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Docker Documentation](https://docs.docker.com)
- [Scikit-learn Documentation](https://scikit-learn.org)

## Getting Help

If you encounter issues:
1. Check the logs: `docker-compose logs [service-name]`
2. Review service README files
3. Check Firebase console for auth issues
4. Verify all environment variables are set

## Next Steps

After successful setup:
1. Explore the chat interface
2. Try different queries
3. Check the dashboard for conversation history
4. Review the prediction results
5. Learn about malaria prevention!

---

**Congratulations! Your CliMalaria system is now running! 🎉**

