# 🤝 Contributing to Facial Expression Recognition

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ✨ Add new features
- 🎨 Improve UI/UX
- 🧪 Add tests

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/PranitaAnnaldas/facial-expression-recognition.git
cd facial-expression-recognition
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 4. Set Up Development Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 📝 Development Guidelines

### Code Style

- Follow PEP 8 for Python code
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Python Code Example

```python
def preprocess_image(image_path):
    """
    Preprocess image for model prediction.
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        np.ndarray: Preprocessed image array
    """
    # Load and preprocess image
    image = cv2.imread(image_path)
    # ... rest of the code
    return processed_image
```

### JavaScript Code Style

```javascript
// Use camelCase for variables and functions
function analyzeImage(imageData) {
    // Clear, descriptive names
    const predictions = await fetchPredictions(imageData);
    return predictions;
}
```

### CSS Style

```css
/* Use meaningful class names */
.emotion-result {
    /* Group related properties */
    display: flex;
    flex-direction: column;
    
    /* Add comments for complex styles */
    padding: 20px;
}
```

## 🧪 Testing

### Before Submitting

1. **Test the model**:
```bash
python test_model.py
```

2. **Test the web application**:
```bash
python app.py
# Open http://localhost:5000 and test all features
```

3. **Check for errors**:
- Upload various images
- Test webcam functionality
- Verify all emotions are detected
- Check responsive design on mobile

### Adding Tests

If adding new features, include tests:

```python
def test_new_feature():
    """Test description"""
    # Arrange
    input_data = prepare_test_data()
    
    # Act
    result = new_feature(input_data)
    
    # Assert
    assert result is not None
    assert result.shape == expected_shape
```

## 📋 Pull Request Process

### 1. Commit Your Changes

```bash
git add .
git commit -m "feat: add new emotion detection feature"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test with latest version

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 10]
- Python version: [e.g., 3.10]
- Browser: [e.g., Chrome 120]

**Additional context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired feature

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Mockups, examples, or references
```

## 🎨 UI/UX Contributions

### Design Guidelines

- Maintain consistent color scheme
- Ensure responsive design
- Follow accessibility standards (WCAG 2.1)
- Test on multiple browsers
- Optimize for mobile devices

### Before Submitting UI Changes

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Verify color contrast ratios
- [ ] Check keyboard navigation
- [ ] Test with screen readers (if possible)

## 📚 Documentation Contributions

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for visual features
- Keep formatting consistent
- Check spelling and grammar

### Documentation Checklist

- [ ] Clear and accurate
- [ ] Includes examples
- [ ] Properly formatted
- [ ] Links work correctly
- [ ] No typos

## 🔍 Code Review Process

### What We Look For

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Is it clean and maintainable?
3. **Performance**: Is it efficient?
4. **Security**: Are there any vulnerabilities?
5. **Documentation**: Is it well-documented?
6. **Tests**: Are there adequate tests?

### Review Timeline

- Initial review: Within 3-5 days
- Follow-up reviews: Within 2-3 days
- Merge: After approval from maintainers

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in commit history

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open an Issue
- **Security**: Email maintainers directly

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behavior:**
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

## 🎓 Learning Resources

### Python & Flask
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Python Style Guide](https://pep8.org/)

### TensorFlow & ML
- [TensorFlow Tutorials](https://www.tensorflow.org/tutorials)
- [Keras Documentation](https://keras.io/)

### Web Development
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Guide](https://javascript.info/)

## ✅ Contribution Checklist

Before submitting your contribution:

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No merge conflicts
- [ ] Commit messages are clear
- [ ] PR description is complete

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Questions?** Open an issue or discussion on GitHub.

**Happy Contributing!** 🚀
