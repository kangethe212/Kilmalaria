# 🔧 Railway Deployment Troubleshooting

## Console Errors Explained

The errors you're seeing are **NOT critical**:

1. **Railway ASCII Art** ✅ - Normal Railway welcome message
2. **React SSRProvider Warning** ⚠️ - Harmless React 18 warning
3. **SVG viewBox Errors** ⚠️ - From osano.js (third-party script), doesn't affect functionality

---

## Check Railway Deployment Status

### Step 1: Verify Service is Running

1. **Go to Railway Dashboard**: https://railway.app
2. **Click on your project**
3. **Click on the ML Service**
4. **Check "Deployments" tab**:
   - Should show "Active" status
   - Green checkmark = Success
   - Red X = Failed

### Step 2: Check Build Logs

1. **Click "Deployments" tab**
2. **Click on latest deployment**
3. **Check logs** for:
   - ✅ "Build successful"
   - ✅ "Starting application"
   - ❌ Any error messages

### Step 3: Verify Root Directory

**CRITICAL**: Make sure Root Directory is set correctly!

1. **Go to Service → Settings**
2. **Check "Root Directory"**
3. **Should be**: `ml-service`
4. **If wrong**: Change it and redeploy

---

## Common Railway Issues

### Issue: "Service not responding"

**Check**:
1. Root Directory is `ml-service` ✅
2. Start Command is `python app.py` ✅
3. Build completed successfully
4. Port is set correctly (Railway auto-assigns)

**Fix**:
- Check Railway logs for errors
- Verify `requirements.txt` has all dependencies
- Check if model files exist

### Issue: "Build failed"

**Check logs for**:
- Missing dependencies
- Python version mismatch
- File not found errors

**Fix**:
- Verify `requirements.txt` is complete
- Check `runtime.txt` specifies correct Python version
- Ensure all files are committed to GitHub

### Issue: "Module not found"

**Fix**:
- Check `requirements.txt` includes all packages
- Verify model files are in repo
- Check import paths in `app.py`

---

## Test Your Railway Service

### Get Your Railway URL

1. **Railway Dashboard** → Your Service
2. **Settings** → **Networking**
3. **Copy the URL** (e.g., `https://kilmalaria-ml-service-production.up.railway.app`)

### Test Endpoints

```powershell
# Test health endpoint
curl https://your-railway-url.up.railway.app/health

# Test counties endpoint
curl https://your-railway-url.up.railway.app/counties
```

**Expected Response**:
```json
{
  "status": "healthy",
  "service": "Kilmalaria ML Service"
}
```

---

## Verify Deployment Configuration

### Check These Files Exist:

- ✅ `ml-service/Procfile` - Start command
- ✅ `ml-service/runtime.txt` - Python version
- ✅ `ml-service/requirements.txt` - Dependencies
- ✅ `ml-service/app.py` - Main application

### Check Railway Settings:

1. **Root Directory**: `ml-service`
2. **Start Command**: `python app.py` (from Procfile)
3. **Environment**: Python 3.11
4. **Port**: Auto-assigned by Railway

---

## Quick Fixes

### If Service Won't Start:

1. **Check Railway Logs**:
   - Go to Railway Dashboard
   - Click on service
   - View "Logs" tab
   - Look for error messages

2. **Verify Start Command**:
   - Should be: `python app.py`
   - Check Procfile exists

3. **Check Dependencies**:
   - Railway installs from `requirements.txt`
   - Verify all packages are listed

---

## Next Steps After Railway Deployment

1. ✅ Get Railway production URL
2. ✅ Test `/health` endpoint
3. ✅ Update `frontend/.env` with Railway URL
4. ✅ Rebuild and redeploy frontend
5. ✅ Test complete flow

---

**Share your Railway URL and I'll help you test it!** 🚀

