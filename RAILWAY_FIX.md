# 🚂 Railway Deployment Fix

## Error Fixed
```
ImportError: libGL.so.1: cannot open shared object file: No such file or directory
```

## Root Cause
OpenCV requires system libraries (OpenGL) that aren't installed by default on Railway.

## Solution Applied

### 1. Changed opencv-python to opencv-python-headless
**In requirements.txt:**
```
opencv-python-headless>=4.8.0
```

The "headless" version doesn't require GUI libraries (libGL).

### 2. Created nixpacks.toml
Railway uses Nixpacks for builds. This file tells it to install required system packages:
```toml
[phases.setup]
aptPkgs = ["libgl1-mesa-glx", "libglib2.0-0"]
```

### 3. Created aptfile (backup)
Alternative method for installing system packages.

## Deploy to Railway

### Step 1: Push Changes
```bash
git add requirements.txt nixpacks.toml aptfile
git commit -m "Fix: Add Railway configuration and use opencv-headless"
git push origin main
```

### Step 2: Railway Auto-Deploys
Railway will automatically detect the changes and redeploy.

### Step 3: Verify
Check Railway logs for:
```
✅ Model loaded and memory optimized
[INFO] Starting gunicorn 23.0.0
[INFO] Listening at: http://0.0.0.0:8080
```

## Railway Configuration

### Environment Variables (Optional)
In Railway dashboard, you can set:

| Variable | Value |
|----------|-------|
| `PORT` | Auto-set by Railway |
| `MODEL_PATH` | `trained_models/emotion_model_best.h5` |
| `PYTHON_VERSION` | `3.10` |

### Start Command (Auto-detected)
Railway should auto-detect from Procfile:
```
gunicorn app:app --timeout 180 --workers 1 --bind 0.0.0.0:$PORT
```

## Expected Behavior

### Build Logs:
```
Installing system packages...
✓ libgl1-mesa-glx
✓ libglib2.0-0
Installing Python packages...
✓ opencv-python-headless
✓ tensorflow
✓ flask
Build successful!
```

### Runtime Logs:
```
📦 Loading model with memory optimization...
✅ Model loaded and memory optimized
[INFO] Starting gunicorn 23.0.0
[INFO] Listening at: http://0.0.0.0:8080
```

## Railway vs Render

### Railway Advantages:
- ✅ $5 free credit per month
- ✅ Better for ML apps
- ✅ Faster builds
- ✅ More generous resource limits
- ✅ Better logging

### Railway Limitations:
- ⚠️ Free credit runs out (then $0.000231/min)
- ⚠️ Need to add payment method
- ⚠️ Sleeps after inactivity (like Render free)

## Cost Estimate

### Free Tier ($5 credit):
- **Light usage**: 2-3 weeks
- **Medium usage**: 1-2 weeks
- **Heavy usage**: < 1 week

### After Free Credit:
- **Cost**: ~$5-10/month for light usage
- **Billing**: Pay-as-you-go (per minute)

## Troubleshooting

### Still Getting libGL Error?

**Check 1**: Verify opencv-python-headless is installed
```bash
# In Railway shell
pip list | grep opencv
# Should show: opencv-python-headless
```

**Check 2**: Verify system packages installed
```bash
# In Railway shell
dpkg -l | grep libgl
# Should show: libgl1-mesa-glx
```

**Check 3**: Try alternative opencv package
Update requirements.txt:
```
opencv-contrib-python-headless>=4.8.0
```

### Out of Memory on Railway?

Railway free tier has similar memory limits. If you get OOM:

1. **Upgrade Railway plan** ($5-10/month)
2. **Or use Render paid tier** ($7/month)
3. **Or optimize model** (TFLite conversion)

### Build Fails?

**Check nixpacks.toml syntax**:
```toml
[phases.setup]
aptPkgs = ["libgl1-mesa-glx", "libglib2.0-0"]

[phases.install]
cmds = ["pip install -r requirements.txt"]

[start]
cmd = "gunicorn app:app --timeout 180 --workers 1 --bind 0.0.0.0:$PORT"
```

## Alternative: Docker Deployment

If Railway still has issues, use Docker:

**Create Dockerfile:**
```dockerfile
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080
CMD ["gunicorn", "app:app", "--timeout", "180", "--workers", "1", "--bind", "0.0.0.0:8080"]
```

Railway will auto-detect and use the Dockerfile.

## Comparison: Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| **Free Tier** | $5 credit/month | 512 MB RAM, sleeps |
| **Memory** | More flexible | 512 MB (free) |
| **Build Speed** | Faster | Slower |
| **Logs** | Better | Good |
| **ML Support** | Better | Limited |
| **Cost** | Pay-as-you-go | $7/month (paid) |
| **Best For** | ML apps | Web apps |

## Recommendation

### For Your App:

1. **Try Railway first** (with these fixes)
   - Should work with $5 credit
   - Better for ML apps
   - Good for testing

2. **If Railway credit runs out**:
   - Upgrade Railway ($5-10/month)
   - Or switch to Render paid ($7/month)

3. **For production**:
   - Railway or Render paid tier
   - Both are reliable
   - Similar cost

## Next Steps

1. **Push the fixes**:
   ```bash
   git add .
   git commit -m "Fix: Railway deployment with opencv-headless"
   git push origin main
   ```

2. **Wait for Railway to redeploy** (2-3 minutes)

3. **Check logs** for successful startup

4. **Test the app** - Upload an image

5. **Monitor usage** - Check Railway dashboard for credit usage

## Success Indicators

✅ Build completes without errors
✅ No libGL import errors
✅ Model loads successfully
✅ Server starts on port 8080
✅ Image upload works
✅ Predictions return results

---

**Status**: Fix Applied ✅  
**Platform**: Railway  
**Next**: Push changes and redeploy
