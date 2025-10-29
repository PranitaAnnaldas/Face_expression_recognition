# 🔧 Render Deployment Fix

## Problem
- ❌ 502 Bad Gateway error when uploading images
- ❌ "Failed to analyze image" message
- ❌ Worker timeout during prediction

## Root Cause
The Gunicorn worker timeout (default 30 seconds) is too short for:
1. Loading the 78 MB model
2. Processing images with TensorFlow on CPU
3. Face detection and prediction

## Solution

### Option 1: Update via Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click on your service: `facial-expression-recognition`

2. **Update Start Command**
   - Click "Settings" tab
   - Scroll to "Build & Deploy"
   - Find "Start Command"
   - Replace with:
     ```
     gunicorn app:app --timeout 120 --workers 1 --bind 0.0.0.0:$PORT --log-level info
     ```
   - Click "Save Changes"

3. **Manual Deploy**
   - Go to "Manual Deploy" section
   - Click "Deploy latest commit"
   - Wait for deployment to complete

### Option 2: Use render.yaml (Automatic)

The `render.yaml` file is now in your repository. Render will automatically detect and use it on next deployment.

**To activate:**
1. Commit and push changes:
   ```bash
   git add render.yaml app.py
   git commit -m "Fix: Add render.yaml and improve error handling"
   git push origin main
   ```

2. Render will auto-deploy with correct settings

### Option 3: Environment Variables

Add these in Render Dashboard → Settings → Environment:

| Variable | Value |
|----------|-------|
| `GUNICORN_TIMEOUT` | `120` |
| `GUNICORN_WORKERS` | `1` |
| `MODEL_PATH` | `trained_models/emotion_model_best.h5` |

## Verification

### 1. Check Logs
After deployment, check logs for:
```
🚀 Starting Facial Expression Recognition Server...
📊 Model loaded: trained_models/emotion_model_best.h5
🎭 Emotions: angry, disgust, fear, happy, neutral, sad, surprise
✅ Server ready on port 10000
[INFO] Starting gunicorn 23.0.0
[INFO] Listening at: http://0.0.0.0:10000
```

### 2. Test Health Endpoint
```bash
curl https://facial-expression-recognition-3stp.onrender.com/health
```

Expected response:
```json
{
    "status": "healthy",
    "model_loaded": true
}
```

### 3. Test Prediction
Upload an image on the website and check logs for:
```
📥 Prediction request received
📊 Image data size: XXXXX bytes
🖼️ Image shape: (height, width, channels)
👤 Detecting faces...
✅ Found X face(s)
🎭 Processing face 1/X
🧠 Predicting emotion for face 1...
✅ Detected: happy (87.34%)
🎉 Successfully processed X face(s)
```

## Troubleshooting

### Still Getting 502 Error?

**Check 1: Worker Timeout**
- Logs show: `WORKER TIMEOUT (pid:XX)`
- Solution: Increase timeout to 180 seconds
  ```
  gunicorn app:app --timeout 180 --workers 1 --bind 0.0.0.0:$PORT
  ```

**Check 2: Memory Limit**
- Logs show: `Worker was sent SIGKILL! Perhaps out of memory?`
- Solution: Upgrade to paid plan (more RAM) or optimize model
- Free tier: 512 MB RAM
- Paid tier: 2 GB+ RAM

**Check 3: Model Loading**
- Logs show: `FileNotFoundError: emotion_model_best.h5`
- Solution: Verify model is in `trained_models/` folder
- Check: `ls trained_models/` in Render shell

### Still Not Working?

**Enable Debug Logging:**
1. Update start command:
   ```
   gunicorn app:app --timeout 120 --workers 1 --bind 0.0.0.0:$PORT --log-level debug --access-logfile - --error-logfile -
   ```

2. Check logs for detailed error messages

**Test Locally First:**
```bash
# Activate virtual environment
venv\Scripts\activate

# Run with Gunicorn (same as Render)
pip install gunicorn
gunicorn app:app --timeout 120 --workers 1 --bind 0.0.0.0:5000

# Test in browser
# Open: http://localhost:5000
```

## Performance Tips

### For Free Tier

1. **Single Worker** (saves memory)
   ```
   --workers 1
   ```

2. **Longer Timeout** (allows model loading)
   ```
   --timeout 120
   ```

3. **Preload App** (load model before forking)
   ```
   --preload
   ```

4. **Optimize Images** (client-side)
   - Resize to max 1024x1024 before upload
   - Compress to < 1 MB

### For Paid Tier

1. **Multiple Workers** (better performance)
   ```
   --workers 2
   ```

2. **Worker Class** (async processing)
   ```
   --worker-class gevent --workers 2
   ```

3. **Keep Alive** (reduce connection overhead)
   ```
   --keep-alive 5
   ```

## Expected Performance

### Free Tier (CPU Only)
- Cold start: 30-60 seconds
- First prediction: 5-10 seconds
- Subsequent predictions: 2-5 seconds
- Concurrent requests: 1 at a time

### Paid Tier (More RAM)
- Cold start: 10-20 seconds
- First prediction: 3-5 seconds
- Subsequent predictions: 1-2 seconds
- Concurrent requests: 2-4 at a time

## Alternative Solutions

### If Free Tier Doesn't Work

1. **Optimize Model**
   - Convert to TensorFlow Lite (smaller, faster)
   - Quantize model (reduce size)
   - Use MobileNet architecture

2. **Use Different Platform**
   - Railway (more generous free tier)
   - Fly.io (better for ML apps)
   - Google Cloud Run (pay per use)

3. **Upgrade to Paid**
   - Render: $7/month
   - More RAM, always-on
   - Better performance

## Quick Commands

### Update and Deploy
```bash
# Update files
git add .
git commit -m "Fix: Increase Gunicorn timeout"
git push origin main

# Render auto-deploys
```

### Check Logs
```bash
# Via Render CLI (if installed)
render logs -s facial-expression-recognition

# Or visit dashboard
# https://dashboard.render.com/web/[your-service-id]/logs
```

### Manual Redeploy
1. Go to Render Dashboard
2. Click "Manual Deploy"
3. Select "Deploy latest commit"
4. Wait for completion

## Success Indicators

✅ Logs show model loaded successfully
✅ Health endpoint returns 200 OK
✅ Image upload shows "Analyzing emotions..."
✅ Results display with emotion and confidence
✅ No 502 errors in browser console
✅ Logs show successful predictions

## Need More Help?

1. **Check Render Logs** - Most issues show up here
2. **Test Locally** - Verify it works on your machine
3. **Check Browser Console** - Look for JavaScript errors
4. **Open GitHub Issue** - Share logs and error messages

---

**Last Updated**: October 2025  
**Status**: Fix Applied ✅  
**Next Step**: Push changes and redeploy
