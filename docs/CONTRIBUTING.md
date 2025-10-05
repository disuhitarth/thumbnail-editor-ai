# Contributing to AI Thumbnail Editor

Thank you for your interest in contributing to AI Thumbnail Editor! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use clear titles** that describe the issue concisely
3. **Provide details** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features

1. **Open a feature request** issue
2. **Describe the use case** and why it would be valuable
3. **Consider implementation** impact and complexity
4. **Be open to discussion** and feedback

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test thoroughly** before submitting
5. **Submit a pull request** with clear description

## 🛠️ Development Setup

### Prerequisites
- Node.js 18.0+
- npm or yarn
- Git
- Google Gemini API key

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-thumbnail-editor.git
cd ai-thumbnail-editor

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Start development server
npm run dev
```

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible

### Code Style
- Follow existing formatting conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Handle loading and error states
- Optimize re-renders when necessary

## 🧪 Testing

### Before Submitting
- Test your changes in multiple browsers
- Verify responsive design works
- Test image upload and paste functionality
- Ensure AI integration works properly

### Test Scenarios
- Upload different image formats
- Test clipboard paste functionality
- Verify history navigation works
- Test with various prompt types

## 📋 Pull Request Guidelines

### PR Title
Use descriptive titles following this format:
- `feat: add batch image processing`
- `fix: resolve clipboard paste on Safari`
- `docs: update installation instructions`
- `refactor: optimize thumbnail generation`

### PR Description
Include:
- **What** changes were made
- **Why** the changes were necessary
- **How** to test the changes
- **Screenshots** for UI changes
- **Breaking changes** if any

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Testing on different environments
4. Approval and merge

## 🎯 Priority Areas

We especially welcome contributions in these areas:

### High Priority
- Performance optimizations
- Mobile responsiveness improvements
- Error handling enhancements
- Accessibility improvements

### Medium Priority
- New AI editing features
- UI/UX enhancements
- Documentation improvements
- Test coverage expansion

### Feature Requests
- Batch image processing
- Additional export formats
- Custom AI model integration
- User authentication system

## 🚀 Release Process

1. **Feature Development** - Work on feature branches
2. **Code Review** - Thorough review process
3. **Testing** - Comprehensive testing cycle
4. **Documentation** - Update relevant docs
5. **Release** - Version bump and deployment

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and general chat
- **Documentation** - Check existing docs first

## 🏆 Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- GitHub contributor graph

Thank you for helping make AI Thumbnail Editor better! 🎉