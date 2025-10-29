from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import base64
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the trained model
import os
MODEL_PATH = os.environ.get('MODEL_PATH', 'trained_models/emotion_model_best.h5')
model = tf.keras.models.load_model(MODEL_PATH)

# Emotion labels
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# Load face cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def preprocess_face(face_img):
    """Preprocess face image for model prediction"""
    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    face_img = cv2.resize(face_img, (48, 48))
    face_img = face_img.astype('float32') / 255.0
    face_img = np.expand_dims(face_img, axis=-1)
    face_img = np.expand_dims(face_img, axis=0)
    return face_img

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Log request received
        print("📥 Prediction request received")
        
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        image_data = data['image'].split(',')[1]
        print(f"📊 Image data size: {len(image_data)} bytes")
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        print(f"🖼️ Image shape: {image_np.shape}")
        
        # Convert RGB to BGR for OpenCV
        if len(image_np.shape) == 3 and image_np.shape[2] == 3:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        elif len(image_np.shape) == 2:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_GRAY2BGR)
        
        # Detect faces
        print("👤 Detecting faces...")
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        print(f"✅ Found {len(faces)} face(s)")
        
        if len(faces) == 0:
            return jsonify({'error': 'No face detected in the image'}), 400
        
        results = []
        for idx, (x, y, w, h) in enumerate(faces):
            print(f"🎭 Processing face {idx + 1}/{len(faces)}")
            face_roi = image_np[y:y+h, x:x+w]
            preprocessed_face = preprocess_face(face_roi)
            
            # Predict emotion
            print(f"🧠 Predicting emotion for face {idx + 1}...")
            predictions = model.predict(preprocessed_face, verbose=0)[0]
            emotion_idx = np.argmax(predictions)
            emotion = EMOTIONS[emotion_idx]
            confidence = float(predictions[emotion_idx])
            print(f"✅ Detected: {emotion} ({confidence:.2%})")
            
            # Get all emotion probabilities
            emotion_probs = {EMOTIONS[i]: float(predictions[i]) for i in range(len(EMOTIONS))}
            
            results.append({
                'emotion': emotion,
                'confidence': confidence,
                'all_emotions': emotion_probs,
                'bbox': {'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h)}
            })
        
        print(f"🎉 Successfully processed {len(results)} face(s)")
        return jsonify({'success': True, 'faces': results})
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Starting Facial Expression Recognition Server...")
    print(f"📊 Model loaded: {MODEL_PATH}")
    print(f"🎭 Emotions: {', '.join(EMOTIONS)}")
    print(f"✅ Server ready on port {port}")
    app.run(debug=False, host='0.0.0.0', port=port)
