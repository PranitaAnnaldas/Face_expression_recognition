# 🚀 Deployment Guide

## Live Deployment

**URL**: [https://facial-expression-recognition-3stp.onrender.com](https://facial-expression-recognition-3stp.onrender.com)

## Render Deployment

### Current Status
✅ **Successfully Deployed** on Render Free Tier

### Configuration
- **Platform**: Render
- **Plan**: Free Tier
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Port**: Auto-detected (10000)
- **Environment**: Python 3

### Known Issues & Solutions

#### 1. Worker Timeout
**Issue**: `WORKER TIMEOUT (pid:83)` and `Worker was sent SIGKILL! Perhaps out of memory?`

**Cause**: 
- Model loading takes time (~20-30 seconds)
- Free tier has 512 MB RAM limit
- Default Gunicorn timeout is 30 seconds

**Solution**: Increase timeout in start command
```bash
gunicorn app:app --timeout 120 --workers 1
```

**To Update on Render**:
1. Go to your service dashboard
2. Click "Settings"
3. Update "Start Command" to:
   ```
   gunicorn app:app --timeout 120 --workers 1 --bind 0.0.0.0:$PORT
   ```
4. Click "Save Changes"
5. Service will auto-redeploy

#### 2. Cold Start Delay
**Issue**: First request takes 30-60 seconds

**Cause**: Free tier spins down after 15 minutes of inactivity

**Solutions**:
- Upgrade to paid plan ($7/month) for always-on
- Use a ping service (UptimeRobot) to keep it alive
- Accept the delay (it's free!)

#### 3. Memory Limit
**Issue**: Model is 78 MB, close to 512 MB limit

**Solutions**:
- Use single worker: `--workers 1`
- Optimize model (convert to TFLite)
- Upgrade to paid plan (more RAM)

### Recommended Start Command

For best performance on free tier:
```bash
gunicorn app:app --timeout 120 --workers 1 --bind 0.0.0.0:$PORT --preload
```

Explanation:
- `--timeout 120`: Allow 2 minutes for model loading
- `--workers 1`: Single worker to save memory
- `--bind 0.0.0.0:$PORT`: Bind to Render's port
- `--preload`: Load model before forking workers

### Environment Variables

Set these in Render dashboard (Settings → Environment):

| Variable | Value | Purpose |
|----------|-------|---------|
| `PYTHON_VERSION` | `3.10` | Python version |
| `MODEL_PATH` | `emotion_model_best.h5` | Model file path |
| `PORT` | Auto-set by Render | Server port |

### Monitoring

**Check Logs**:
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Monitor for errors

**Health Check**:
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

## Alternative Deployment Options

### 1. Heroku

**Pros**: Easy deployment, good free tier
**Cons**: Requires credit card, sleeps after 30 min

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Add Procfile
echo "web: gunicorn app:app --timeout 120" > Procfile

# Deploy
git push heroku main
```

### 2. Railway

**Pros**: Very easy, generous free tier
**Cons**: Requires GitHub connection

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Railway auto-detects and deploys

### 3. Google Cloud Run

**Pros**: Scales to zero, pay per use
**Cons**: Requires GCP account

```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/emotion-recognition

# Deploy
gcloud run deploy --image gcr.io/PROJECT_ID/emotion-recognition --platform managed
```

### 4. AWS Elastic Beanstalk

**Pros**: Scalable, AWS ecosystem
**Cons**: More complex setup

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.10 emotion-recognition

# Create environment
eb create emotion-recognition-env

# Deploy
eb deploy
```

### 5. DigitalOcean App Platform

**Pros**: Simple, good performance
**Cons**: No free tier

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Click "Create" → "Apps"
3. Connect GitHub repository
4. Configure build settings
5. Deploy

## Performance Optimization

### For Production Deployment

1. **Use Gunicorn with multiple workers**
```bash
gunicorn app:app --workers 4 --timeout 120
```

2. **Enable caching**
```python
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
```

3. **Compress responses**
```python
from flask_compress import Compress
Compress(app)
```

4. **Use CDN for static files**
- Upload CSS/JS to CDN
- Update template links

5. **Optimize model**
```python
# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
```

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Render** | 512 MB RAM, sleeps | $7/mo, always-on | Current choice ✅ |
| **Heroku** | 550 hrs/mo, sleeps | $7/mo, always-on | Easy deployment |
| **Railway** | $5 credit/mo | $5/mo usage-based | Simple projects |
| **Vercel** | Limited | $20/mo | Frontend-heavy |
| **AWS** | 12 months free | Pay-as-you-go | Enterprise |
| **GCP** | $300 credit | Pay-as-you-go | ML workloads |

## Troubleshooting

### Deployment Fails

**Check**:
1. `requirements.txt` is correct
2. Model file is committed to repo
3. Build logs for errors
4. Python version compatibility

### App Crashes

**Check**:
1. Memory usage (upgrade if needed)
2. Timeout settings
3. Error logs
4. Model file path

### Slow Performance

**Solutions**:
1. Upgrade to paid tier
2. Use GPU instance (AWS/GCP)
3. Optimize model size
4. Add caching
5. Use CDN

## Security Considerations

### For Production

1. **Enable HTTPS** (Render does this automatically)
2. **Add rate limiting**
```python
from flask_limiter import Limiter
limiter = Limiter(app, key_func=lambda: request.remote_addr)
```

3. **Validate inputs**
```python
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
if len(image_data) > MAX_FILE_SIZE:
    return jsonify({'error': 'File too large'}), 400
```

4. **Add CORS restrictions**
```python
CORS(app, origins=["https://yourdomain.com"])
```

5. **Use environment variables**
```python
SECRET_KEY = os.environ.get('SECRET_KEY')
```

## Monitoring & Analytics

### Add Monitoring

1. **Sentry** (Error tracking)
```python
import sentry_sdk
sentry_sdk.init(dsn="YOUR_DSN")
```

2. **Google Analytics** (Usage tracking)
Add to `templates/index.html`

3. **Uptime Monitoring**
- [UptimeRobot](https://uptimerobot.com) - Free
- [Pingdom](https://www.pingdom.com) - Paid

## Backup & Recovery

### Backup Strategy

1. **Code**: GitHub (already done ✅)
2. **Model**: Keep in repo and Google Drive
3. **Logs**: Download from Render periodically
4. **Database**: Not applicable (stateless app)

### Disaster Recovery

If deployment fails:
1. Check Render logs
2. Rollback to previous version
3. Redeploy from GitHub
4. Contact Render support

## Scaling

### When to Scale

Signs you need to upgrade:
- ⏱️ Consistent timeouts
- 💾 Out of memory errors
- 🐌 Slow response times (> 5s)
- 📈 High traffic (> 1000 req/day)

### Scaling Options

1. **Vertical** (Render paid tier)
   - More RAM
   - More CPU
   - Always-on

2. **Horizontal** (Multiple instances)
   - Load balancer
   - Multiple workers
   - Database for state

3. **Optimize** (Before scaling)
   - Cache responses
   - Optimize model
   - Use CDN
   - Compress images

## Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **This Project**: Open an issue on GitHub

---

**Last Updated**: October 2025  
**Deployment Status**: Live ✅  
**URL**: https://facial-expression-recognition-3stp.onrender.com
