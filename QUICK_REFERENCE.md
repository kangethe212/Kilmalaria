# 🚀 CLIMALARIA - QUICK REFERENCE CARD

## ⚡ START SERVICES

### **Backend:**
```powershell
cd "C:\Users\Malaria final project\ml-service"
python app.py
```
**URL:** http://localhost:8000

### **Frontend:**
```powershell
cd "C:\Users\Malaria final project\frontend"
npm run dev
```
**URL:** http://localhost:5173

---

## 📊 KEY STATISTICS

```
✅ Dataset: 40,042 records
✅ Counties: 47 (100% Kenya)
✅ Years: 2014-2025 (12 years)
✅ ML Accuracy: 76.67% (robust)
✅ Algorithm: GradientBoosting
✅ Total Cases: 9.1 million
```

---

## 🌐 MAIN URLS

```
Landing:    http://localhost:5173/
Features:   http://localhost:5173/features
How It Works: http://localhost:5173/how-it-works
Login:      http://localhost:5173/auth
Dashboard:  http://localhost:5173/dashboard
Chat:       http://localhost:5173/chat
Predictions: http://localhost:5173/predictions
Analytics:  http://localhost:5173/analytics
Backend:    http://localhost:8000
```

---

## 🔐 FIREBASE

```
Project: kilmalaria
Auth: Email/Password
Database: Firestore
```

---

## 🤖 CHATBOT TEST QUESTIONS

```
• "Hello"
• "Predict malaria in Nairobi for 6 months"
• "Show me Kisumu statistics"
• "What are malaria symptoms?"
• "List all counties"
• "How to prevent malaria?"
```

---

## 📁 KEY FILES

```
Backend:
- ml-service/app.py (Flask API)
- ml-service/chatbot_v2.py (AI Chatbot)
- ml-service/malaria_master_dataset.csv (40,042 records)
- ml-service/models/malaria_model.pkl (Trained model)

Frontend:
- frontend/src/App.jsx (Main routing)
- frontend/src/pages/*.jsx (12 pages)
- frontend/src/components/ChatMessage.jsx (Chat rendering)
- frontend/src/services/firebase.js (Auth)
```

---

## 🐛 TROUBLESHOOTING

### **Frontend not starting:**
```
1. Ctrl+C (stop)
2. Remove-Item -Recurse node_modules\.vite
3. npm run dev
```

### **Backend error:**
```
1. Check: python app.py
2. Verify: malaria_master_dataset.csv exists
3. Check: models/ folder has .pkl files
```

### **Blank page:**
```
1. Ctrl+Shift+R (clear browser cache)
2. F12 → Console (check errors)
3. Restart frontend server
```

---

## ✅ STATUS: COMPLETE & READY!

**Developer:** Benson Maina, Machakos University  
**Date:** November 13, 2025  
**Project:** Climalaria - AI Malaria Prediction System

