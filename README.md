# 🎭 Facial Expression Recognition

A real-time facial expression recognition system powered by deep learning. This application uses a Convolutional Neural Network (CNN) to detect and classify human emotions from images and webcam feeds.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20-orange.svg)
![Flask](https://img.shields.io/badge/Flask-3.1-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🌟 Features

### Core Functionality
- 🎯 **7 Emotion Detection**: Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise
- 📷 **Real-time Webcam Support**: Capture and analyze emotions live
- 📁 **Image Upload**: Analyze emotions from photos
- 👥 **Multi-face Detection**: Detect multiple faces in one image
- 📊 **Confidence Scores**: View probability distribution for all emotions

### UI Features
- ✨ **Animated Interface**: Beautiful gradients and smooth animations
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile
- 🖱️ **Drag & Drop**: Drop images directly onto the interface
- 📚 **Detection History**: View your last 10 detections
- 🔗 **Share Results**: Share via native API or copy to clipboard
- 💾 **Download Results**: Export detection results
- ⌨️ **Keyboard Shortcuts**: Quick access (Ctrl+U, Ctrl+W, Ctrl+H)
- 🎨 **Interactive Modals**: Help and About sections

## 🚀 Quick Start

### Installation (3 Steps)

1. **Install Dependencies**
```bash
pip install flask tensorflow opencv-python numpy pillow flask-cors
```

2. **Verify Model File**
Make sure `emotion_model_best.h5` is in the project folder.

3. **Run the App**
```bash
# Activate virtual environment (if using one)
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Start the application
python app.py
```

4. **Open Browser**
Navigate to: `http://localhost:5000`

### Quick Test
```bash
# Test if everything works
python test_model.py
```

## 🎯 Model Performance

### Training Results
- **Validation Accuracy**: 65.8%
- **Training Accuracy**: 63.6%
- **Model Size**: 78 MB
- **Parameters**: 6.5M
- **Dataset**: [Face Expression Recognition Dataset](https://www.kaggle.com/datasets/jonathanoheix/face-expression-recognition-dataset) (28,709 training images)

### Per-Emotion Performance
| Emotion | Accuracy | Notes |
|---------|----------|-------|
| 😊 Happy | ~85% | Best performance |
| 😲 Surprise | ~76% | Very good |
| 😐 Neutral | ~70% | Good |
| 😢 Sad | ~56% | Moderate |
| 😠 Angry | ~55% | Moderate |
| 😨 Fear | ~50% | Challenging |
| 🤢 Disgust | ~55% | Limited data |

### Model Architecture
```
Input: 48x48 grayscale images

Block 1: Conv2D(64) → BatchNorm → ReLU → Conv2D(64) → MaxPool → Dropout(0.25)
Block 2: Conv2D(128) → BatchNorm → ReLU → Conv2D(128) → MaxPool → Dropout(0.25)
Block 3: Conv2D(256) → BatchNorm → ReLU → Conv2D(256) → MaxPool → Dropout(0.25)
Block 4: Conv2D(512) → BatchNorm → ReLU → Conv2D(512) → MaxPool → Dropout(0.25)

Dense: Flatten → Dense(512) → Dense(256) → Dense(7, softmax)
```

## 💻 Usage Guide

### Web Interface

**Upload Image:**
1. Click "Upload Image" or drag & drop
2. Wait for analysis
3. View emotion with confidence scores

**Use Webcam:**
1. Click "Use Webcam"
2. Allow camera permissions
3. Click "Capture Photo"
4. View results

**Keyboard Shortcuts:**
- `Ctrl + U` - Upload image
- `Ctrl + W` - Open webcam
- `Ctrl + H` - Open help
- `ESC` - Close modal/stop webcam

### API Usage

**Endpoint:** `POST /predict`

**Request:**
```python
import requests
import base64

# Read and encode image
with open('image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

# Send request
response = requests.post('http://localhost:5000/predict', json={
    'image': f'data:image/jpeg;base64,{image_data}'
})

result = response.json()
print(result)
```

**Response:**
```json
{
    "success": true,
    "faces": [
        {
            "emotion": "happy",
            "confidence": 0.87,
            "all_emotions": {
                "angry": 0.02,
                "disgust": 0.01,
                "fear": 0.03,
                "happy": 0.87,
                "neutral": 0.04,
                "sad": 0.02,
                "surprise": 0.01
            },
            "bbox": {"x": 100, "y": 150, "w": 200, "h": 200}
        }
    ]
}
```

## 📁 Project Structure

```
facial-expression-recognition/
├── app.py                          # Flask backend
├── test_model.py                   # Model testing script
├── requirements.txt                # Dependencies
├── emotion_model_best.h5          # Trained model (65.8% accuracy)
├── Face_expression_recognition.ipynb  # Training notebook
├── templates/
│   └── index.html                 # Web interface
├── static/
│   ├── style.css                  # Styling & animations
│   └── script.js                  # Frontend logic
├── README.md                      # This file
├── CONTRIBUTING.md                # Contribution guidelines
└── LICENSE                        # MIT License
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `pip install -r requirements.txt` |
| "Model file not found" | Ensure `emotion_model_best.h5` is in root directory |
| "Port 5000 in use" | Change port in `app.py` to 5001 |
| "No face detected" | Use clear, well-lit, frontal face images |
| Webcam not working | Check browser permissions, use HTTPS in production |

### Tips for Best Results
- ✅ Use clear, well-lit photos
- ✅ Face the camera directly
- ✅ Ensure face is unobstructed
- ✅ Use images > 200x200 pixels
- ❌ Avoid blurry or dark images
- ❌ Don't cover your face
- ❌ Avoid extreme angles

## 🎨 Customization

### Change Colors
Edit `static/style.css`:
```css
/* Change primary gradient */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Add New Emotions
1. Update `EMOTIONS` list in `app.py`
2. Retrain model with new classes
3. Update `emotionEmojis` in `static/script.js`

### Change Port
Edit `app.py`:
```python
app.run(debug=True, port=5001)  # Change to your port
```

## 🧠 Training Your Own Model

The included Jupyter notebook (`Face_expression_recognition.ipynb`) contains:
1. Dataset download from Kaggle ([Face Expression Recognition Dataset](https://www.kaggle.com/datasets/jonathanoheix/face-expression-recognition-dataset))
2. Data preprocessing and augmentation
3. Model architecture definition
4. Training with callbacks (EarlyStopping, ReduceLROnPlateau)
5. Evaluation and confusion matrix

**To retrain:**
1. Open notebook in Google Colab
2. Upload Kaggle API credentials (get from [Kaggle Account Settings](https://www.kaggle.com/settings/account))
3. Run all cells
4. Download trained model
5. Replace `emotion_model_best.h5`

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production (Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t emotion-recognition .
docker run -p 5000:5000 emotion-recognition
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See `CONTRIBUTING.md` for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🙏 Acknowledgments

- **Dataset**: [Face Expression Recognition Dataset](https://www.kaggle.com/datasets/jonathanoheix/face-expression-recognition-dataset) from Kaggle
- **Framework**: TensorFlow/Keras
- **Face Detection**: OpenCV Haar Cascades
- **Web Framework**: Flask
- **Icons**: Font Awesome

## 📊 Performance Metrics

### Inference Speed
- Single face (CPU): 50-100ms
- Single face (GPU): 10-20ms
- Multi-face (3-5): 150-300ms

### Accuracy by Use Case
- Controlled environment: 70-75%
- Natural lighting: 60-65%
- Low light: 45-50%
- Multiple faces: 55-60%

## 🔮 Future Enhancements

- [ ] Real-time video stream processing
- [ ] Emotion tracking over time (timeline graph)
- [ ] Batch image processing
- [ ] Export results to CSV/JSON
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Cloud deployment guide
- [ ] Docker Compose setup
- [ ] API rate limiting
- [ ] User authentication

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/PranitaAnnaldas/Face_expression_recognition/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PranitaAnnaldas/Face_expression_recognition/discussions)

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

**Made with ❤️ using TensorFlow, Flask, and lots of emojis!**

*Last Updated: October 2025*
