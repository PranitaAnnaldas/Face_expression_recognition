const uploadBtn = document.getElementById('uploadBtn');
const webcamBtn = document.getElementById('webcamBtn');
const captureBtn = document.getElementById('captureBtn');
const stopWebcamBtn = document.getElementById('stopWebcamBtn');
const fileInput = document.getElementById('fileInput');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('placeholder');
const results = document.getElementById('results');
const resultsContent = document.getElementById('resultsContent');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

let stream = null;

const emotionEmojis = {
    'angry': '😠',
    'disgust': '🤢',
    'fear': '😨',
    'happy': '😊',
    'neutral': '😐',
    'sad': '😢',
    'surprise': '😲'
};

// Upload button click
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            showPreview(event.target.result);
            analyzeImage(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Webcam button click
webcamBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        webcam.srcObject = stream;
        
        hideAll();
        webcam.style.display = 'block';
        captureBtn.style.display = 'inline-block';
        stopWebcamBtn.style.display = 'inline-block';
        webcamBtn.style.display = 'none';
        uploadBtn.style.display = 'none';
    } catch (err) {
        showError('Unable to access webcam. Please check permissions.');
    }
});

// Capture button click
captureBtn.addEventListener('click', () => {
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcam, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    showPreview(imageData);
    stopWebcam();
    analyzeImage(imageData);
});

// Stop webcam button click
stopWebcamBtn.addEventListener('click', () => {
    stopWebcam();
});

function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    webcam.style.display = 'none';
    captureBtn.style.display = 'none';
    stopWebcamBtn.style.display = 'none';
    webcamBtn.style.display = 'inline-block';
    uploadBtn.style.display = 'inline-block';
}

function hideAll() {
    placeholder.style.display = 'none';
    preview.style.display = 'none';
    webcam.style.display = 'none';
    results.style.display = 'none';
    loading.style.display = 'none';
    error.style.display = 'none';
}

function showPreview(imageData) {
    hideAll();
    preview.src = imageData;
    preview.style.display = 'block';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    loading.style.display = 'none';
}

async function analyzeImage(imageData) {
    try {
        results.style.display = 'none';
        error.style.display = 'none';
        loading.style.display = 'block';
        
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        });
        
        const data = await response.json();
        loading.style.display = 'none';
        
        if (data.error) {
            showError(data.error);
            return;
        }
        
        displayResults(data.faces);
    } catch (err) {
        loading.style.display = 'none';
        showError('Failed to analyze image. Please try again.');
        console.error(err);
    }
}

function displayResults(faces) {
    resultsContent.innerHTML = '';
    
    faces.forEach((face, index) => {
        const faceDiv = document.createElement('div');
        faceDiv.className = 'face-result';
        
        const emoji = emotionEmojis[face.emotion] || '😊';
        const confidence = (face.confidence * 100).toFixed(1);
        
        let barsHTML = '';
        const sortedEmotions = Object.entries(face.all_emotions)
            .sort((a, b) => b[1] - a[1]);
        
        sortedEmotions.forEach(([emotion, prob]) => {
            const percentage = (prob * 100).toFixed(1);
            const emotionEmoji = emotionEmojis[emotion] || '😊';
            barsHTML += `
                <div class="emotion-bar">
                    <div class="emotion-label">
                        <span>${emotionEmoji} ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });
        
        faceDiv.innerHTML = `
            ${faces.length > 1 ? `<h3>Face ${index + 1}</h3>` : ''}
            <div class="emotion-main">
                <div class="emotion-emoji">${emoji}</div>
                <div class="emotion-name">${face.emotion}</div>
                <div class="confidence">Confidence: ${confidence}%</div>
            </div>
            <div class="emotion-bars">
                <h4 style="margin-bottom: 15px; color: #667eea;">All Emotions:</h4>
                ${barsHTML}
            </div>
        `;
        
        resultsContent.appendChild(faceDiv);
    });
    
    results.style.display = 'block';
}

// Initialize
hideAll();
placeholder.style.display = 'block';


// History Management
let detectionHistory = JSON.parse(localStorage.getItem('detectionHistory') || '[]');

// Modal Management
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const aboutBtn = document.getElementById('aboutBtn');
const helpBtn = document.getElementById('helpBtn');
const shareBtn = document.getElementById('shareBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearHistoryBtn = document.getElementById('clearHistory');

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Modal Functions
function openModal(content) {
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

modalClose.onclick = closeModal;
window.onclick = (e) => {
    if (e.target === modal) closeModal();
};

// About Modal
if (aboutBtn) {
    aboutBtn.onclick = (e) => {
        e.preventDefault();
        openModal(`
            <h2><i class="fas fa-info-circle"></i> About This Project</h2>
            <p><strong>Facial Expression Recognition</strong> is an AI-powered application that detects emotions from facial images.</p>
            
            <h3>🎯 Features</h3>
            <ul>
                <li>Detects 7 emotions: Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise</li>
                <li>Real-time webcam support</li>
                <li>Multi-face detection</li>
                <li>Confidence scores for all emotions</li>
            </ul>
            
            <h3>🧠 Technology</h3>
            <ul>
                <li><strong>Model:</strong> Deep CNN with 6.5M parameters</li>
                <li><strong>Accuracy:</strong> 65.8% validation accuracy</li>
                <li><strong>Dataset:</strong> FER2013 (28,000+ images)</li>
                <li><strong>Framework:</strong> TensorFlow & Keras</li>
            </ul>
            
            <h3>📊 Performance</h3>
            <ul>
                <li>Happy: ~85% accuracy</li>
                <li>Surprise: ~76% accuracy</li>
                <li>Neutral: ~70% accuracy</li>
            </ul>
            
            <p style="margin-top: 20px; text-align: center;">
                <a href="https://github.com/PranitaAnnaldas/Face_expression_recognition" target="_blank" style="color: #667eea;">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </p>
        `);
    };
}

// Help Modal
if (helpBtn) {
    helpBtn.onclick = (e) => {
        e.preventDefault();
        openModal(`
            <h2><i class="fas fa-question-circle"></i> How to Use</h2>
            
            <h3>📁 Upload Image</h3>
            <ol>
                <li>Click the "Upload Image" button</li>
                <li>Select a photo with a visible face</li>
                <li>Wait for the analysis to complete</li>
                <li>View the detected emotion and confidence scores</li>
            </ol>
            
            <h3>📷 Use Webcam</h3>
            <ol>
                <li>Click the "Use Webcam" button</li>
                <li>Allow camera permissions when prompted</li>
                <li>Position your face in the frame</li>
                <li>Click "Capture Photo" to analyze</li>
            </ol>
            
            <h3>💡 Tips for Best Results</h3>
            <ul>
                <li>✅ Use clear, well-lit photos</li>
                <li>✅ Face the camera directly</li>
                <li>✅ Ensure face is unobstructed</li>
                <li>❌ Avoid blurry or dark images</li>
                <li>❌ Don't cover your face</li>
            </ul>
            
            <h3>🎭 Emotion Classes</h3>
            <p>The model can detect these emotions:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                <span style="padding: 5px 10px; background: #f0f0f0; border-radius: 5px;">😠 Angry</span>
                <span style="padding: 5px 10px; background: #f0f0f0; border-radius: 5px;">🤢 Disgust</span>
                <span style="padding: 5px 10px; background: #f0f0f0; border-radius: 5px;">😨 Fear</span>
                <span style="padding: 5px 10px; background: #f0f0f0; border-radius: 5px;">😊 Happy</span>
                <span style="padding: 5px 10px; background: #f0f0f0; border-radius: 5px;">😐 Neutral</span>
                <span style="padding: 5px 10px; background: #f0f0f0; border-radius: 5px;">😢 Sad</span>
                <span style="padding: 5px 10px; background: #f0f0f0; border-radius: 5px;">😲 Surprise</span>
            </div>
        `);
    };
}

// Share Function
if (shareBtn) {
    shareBtn.onclick = async () => {
        const resultsText = document.getElementById('resultsContent').innerText;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Facial Expression Recognition Results',
                    text: resultsText,
                    url: window.location.href
                });
                showToast('Shared successfully!', 'success');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(resultsText);
                }
            }
        } else {
            copyToClipboard(resultsText);
        }
    };
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Results copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy results', 'error');
    });
}

// Download Results
if (downloadBtn) {
    downloadBtn.onclick = () => {
        const resultsText = document.getElementById('resultsContent').innerText;
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emotion-detection-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Results downloaded!', 'success');
    };
}

// History Functions
function addToHistory(imageData, emotion, confidence) {
    const historyItem = {
        id: Date.now(),
        image: imageData,
        emotion: emotion,
        confidence: confidence,
        timestamp: new Date().toISOString()
    };
    
    detectionHistory.unshift(historyItem);
    if (detectionHistory.length > 10) {
        detectionHistory = detectionHistory.slice(0, 10);
    }
    
    localStorage.setItem('detectionHistory', JSON.stringify(detectionHistory));
    displayHistory();
}

function displayHistory() {
    const historySection = document.getElementById('history');
    const historyContent = document.getElementById('historyContent');
    
    if (detectionHistory.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    
    historySection.style.display = 'block';
    historyContent.innerHTML = '';
    
    detectionHistory.forEach(item => {
        const emoji = emotionEmojis[item.emotion] || '😊';
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.emotion}">
            <div class="history-emotion">${emoji}</div>
            <div class="history-label">${item.emotion}</div>
            <div style="font-size: 0.8em; color: #999;">${(item.confidence * 100).toFixed(1)}%</div>
        `;
        div.onclick = () => {
            showPreview(item.image);
            // Re-analyze if needed
        };
        historyContent.appendChild(div);
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.onclick = () => {
        if (confirm('Clear all detection history?')) {
            detectionHistory = [];
            localStorage.removeItem('detectionHistory');
            displayHistory();
            showToast('History cleared!', 'info');
        }
    };
}

// Enhanced displayResults to add to history
const originalDisplayResults = displayResults;
displayResults = function(faces) {
    originalDisplayResults(faces);
    
    if (faces.length > 0) {
        const mainFace = faces[0];
        const imageData = preview.src;
        addToHistory(imageData, mainFace.emotion, mainFace.confidence);
        
        // Show download button
        if (downloadBtn) {
            downloadBtn.style.display = 'inline-block';
        }
    }
};

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'u':
                e.preventDefault();
                uploadBtn.click();
                break;
            case 'w':
                e.preventDefault();
                webcamBtn.click();
                break;
            case 'h':
                e.preventDefault();
                if (helpBtn) helpBtn.click();
                break;
        }
    }
    
    if (e.key === 'Escape') {
        closeModal();
        stopWebcam();
    }
});

// Enhanced error display
const originalShowError = showError;
showError = function(message) {
    const errorDiv = document.getElementById('error');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
    loading.style.display = 'none';
    showToast(message, 'error');
};

// Drag and Drop Support
const imageContainer = document.querySelector('.image-container');

imageContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageContainer.style.borderColor = '#667eea';
    imageContainer.style.background = 'rgba(102, 126, 234, 0.05)';
});

imageContainer.addEventListener('dragleave', () => {
    imageContainer.style.borderColor = '';
    imageContainer.style.background = '';
});

imageContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    imageContainer.style.borderColor = '';
    imageContainer.style.background = '';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            showPreview(event.target.result);
            analyzeImage(event.target.result);
        };
        reader.readAsDataURL(file);
        showToast('Image uploaded!', 'success');
    } else {
        showToast('Please drop an image file', 'error');
    }
});

// Initialize
displayHistory();
showToast('Welcome! Upload an image or use webcam to get started.', 'info');

// Add animation to emotion tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        const emoji = this.querySelector('.tag-emoji');
        if (emoji) {
            emoji.style.transform = 'scale(1.3) rotate(10deg)';
        }
    });
    
    tag.addEventListener('mouseleave', function() {
        const emoji = this.querySelector('.tag-emoji');
        if (emoji) {
            emoji.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});
