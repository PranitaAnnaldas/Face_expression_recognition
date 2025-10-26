"""
Test script to verify model loading and basic functionality
"""
import tensorflow as tf
import numpy as np
import cv2
import sys

def test_model_loading():
    """Test if model can be loaded"""
    print("🔍 Testing model loading...")
    try:
        model = tf.keras.models.load_model('emotion_model_best.h5')
        print("✅ Model loaded successfully!")
        return model
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        sys.exit(1)

def test_model_architecture(model):
    """Display model architecture"""
    print("\n📊 Model Architecture:")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    print(f"   Total parameters: {model.count_params():,}")
    print(f"   Trainable parameters: {sum([tf.size(w).numpy() for w in model.trainable_weights]):,}")
    
def test_prediction(model):
    """Test model prediction with dummy data"""
    print("\n🧪 Testing prediction...")
    try:
        # Create dummy input (48x48 grayscale image)
        dummy_input = np.random.rand(1, 48, 48, 1).astype('float32')
        
        # Make prediction
        predictions = model.predict(dummy_input, verbose=0)
        
        emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
        predicted_emotion = emotions[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])
        
        print(f"✅ Prediction successful!")
        print(f"   Predicted emotion: {predicted_emotion}")
        print(f"   Confidence: {confidence:.2%}")
        print(f"   All probabilities:")
        for emotion, prob in zip(emotions, predictions[0]):
            print(f"      {emotion:10s}: {prob:.2%}")
        
    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        sys.exit(1)

def test_opencv():
    """Test OpenCV face detection"""
    print("\n👤 Testing face detection...")
    try:
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        if face_cascade.empty():
            print("❌ Failed to load face cascade")
            sys.exit(1)
        print("✅ Face detection cascade loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading face cascade: {e}")
        sys.exit(1)

def test_dependencies():
    """Test all required dependencies"""
    print("\n📦 Testing dependencies...")
    
    dependencies = {
        'TensorFlow': tf.__version__,
        'NumPy': np.__version__,
        'OpenCV': cv2.__version__
    }
    
    for name, version in dependencies.items():
        print(f"   {name:15s}: {version}")
    
    print("✅ All dependencies available!")

def main():
    print("="*60)
    print("🚀 FACIAL EXPRESSION RECOGNITION - MODEL TEST")
    print("="*60)
    
    # Test dependencies
    test_dependencies()
    
    # Test model loading
    model = test_model_loading()
    
    # Test model architecture
    test_model_architecture(model)
    
    # Test prediction
    test_prediction(model)
    
    # Test OpenCV
    test_opencv()
    
    print("\n" + "="*60)
    print("✅ ALL TESTS PASSED!")
    print("="*60)
    print("\n🎉 Your model is ready to use!")
    print("   Run 'python app.py' to start the web application")

if __name__ == "__main__":
    main()
