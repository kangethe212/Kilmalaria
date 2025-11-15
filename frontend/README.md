# CliMalaria Frontend

React-based web application for the CliMalaria intelligent malaria prediction system.

## Features

- 🔐 Firebase Authentication (Email/Password, Google OAuth, Microsoft OAuth)
- 💬 Real-time chat interface with Rasa chatbot
- 📊 Interactive malaria predictions and statistics
- 🗂️ Conversation history with Firestore
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast builds with Vite

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Firebase** - Authentication & Database
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_RASA_URL=http://localhost:5005
VITE_ML_SERVICE_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # Zustand stores
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies
```

## Key Components

### Pages
- **LandingPage** - Public homepage
- **AuthPage** - Login/signup
- **Dashboard** - User dashboard with chat history
- **ChatPage** - Main chat interface with Rasa bot

### Services
- **firebase.js** - Firebase Auth & Firestore integration
- **rasaService.js** - Rasa chatbot API communication

### State Management
- **authStore** - User authentication state
- **chatStore** - Chat messages and conversations

## Firebase Setup Guide

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication methods:
   - Email/Password
   - Google
   - Microsoft
3. Create a Firestore database
4. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
    
    match /contacts/{contactId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_RASA_URL` | Rasa server URL |
| `VITE_ML_SERVICE_URL` | ML service URL |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Use custom hooks for reusable logic

## Deployment

The app can be deployed to:
- **Vercel** (recommended for Vite apps)
- **Netlify**
- **Firebase Hosting**
- **Docker** (using included Dockerfile)

## Troubleshooting

**Firebase errors**: Check that all environment variables are set correctly

**Chat not working**: Ensure Rasa server is running at the correct URL

**Build errors**: Clear node_modules and reinstall dependencies

## License

Part of the CliMalaria project for public health innovation.

