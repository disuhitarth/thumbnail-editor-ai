# ✨ AI Thumbnail Editor

> A powerful, intuitive web application for AI-powered image editing and thumbnail generation

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

## 🚀 Overview

AI Thumbnail Editor is a modern, responsive web application that leverages Google's Gemini AI to provide intelligent image editing capabilities. Upload images through drag-and-drop or clipboard paste, then use natural language prompts to transform your visuals with AI-powered editing.
![Project Screenshot](public/?raw=true "Project Screenshot")

### ✨ Key Features

- **🖼️ Smart Upload System** - Support for drag-and-drop file upload and clipboard paste functionality
- **🤖 AI-Powered Editing** - Natural language image manipulation using Google Gemini AI
- **🔄 Iterative Workflow** - Chain multiple edits together for complex transformations
- **📚 Visual History** - Navigate through your editing timeline with thumbnail previews
- **⚡ Real-time Processing** - Fast, responsive interface with live feedback
- **📱 Responsive Design** - Beautiful gradient UI that works across all devices
- **🎨 Professional Interface** - Clean, modern design with smooth animations

## 🎯 Use Cases

- **Content Creation** - Transform images for social media, blogs, and marketing materials
- **Design Iteration** - Rapidly prototype and refine visual concepts
- **Thumbnail Generation** - Create compelling thumbnails for videos and articles
- **Image Enhancement** - Improve existing images with AI-powered modifications
- **Creative Exploration** - Experiment with different styles and effects

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router and Turbopack
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework

### Backend & AI
- **Google Gemini AI** - Advanced image generation and editing
- **Next.js API Routes** - Serverless function handling
- **File Processing** - Canvas API for thumbnail generation

### Development Tools
- **ESLint** - Code linting and formatting
- **Turbopack** - Ultra-fast bundler for development

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Google Gemini API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/ai-thumbnail-editor.git
   cd ai-thumbnail-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Add your Google Gemini API key to `.env.local`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎮 Usage Guide

### Getting Started

1. **Upload an Image**
   - Click the "Upload Thumbnail" button to select a file
   - Or press `Ctrl+V` (Windows/Linux) or `Cmd+V` (Mac) to paste from clipboard
   - Supported formats: JPG, PNG, GIF, WebP

2. **Edit with AI**
   - Type natural language instructions in the text input
   - Examples: "change background to blue", "add text saying 'Hello'", "make it more colorful"
   - Click "Process Image" to apply changes

3. **Iterate and Refine**
   - The processed image becomes your new starting point
   - Continue editing with additional prompts
   - Use the history strip to navigate between versions

4. **Manage History**
   - View all previous versions in the bottom timeline
   - Click any thumbnail to restore that version
   - History automatically manages the editing stack

### Pro Tips

- **Be Specific**: More detailed prompts yield better results
- **Iterate Gradually**: Make small changes for better control
- **Use History**: Experiment freely knowing you can always go back
- **Clipboard Workflow**: Copy images from other apps and paste directly

## 📁 Project Structure

```
ai-thumbnail-editor/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── process/
│   │   │       └── route.ts          # AI processing endpoint
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout component
│   │   └── page.tsx                  # Main application page
├── assets/                           # Static assets and images
├── docs/                            # Additional documentation
├── public/                          # Public static files
├── .env.local                       # Environment variables (create from .env.example)
├── .env.example                     # Environment template
├── package.json                     # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## 🔧 API Reference

### POST /api/process

Process an image with AI-powered editing.

**Request:**
- `image` (File): Image file to process
- `prompt` (string): Natural language editing instructions

**Response:**
```json
{
  "success": true,
  "generatedImage": "data:image/png;base64,...",
  "imageSize": 12345,
  "prompt": "user prompt",
  "result": "Image generation completed"
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on every push

### Other Platforms

The application can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Performance Features

- **Optimized Thumbnails** - Canvas-based compression for fast loading
- **Smart Caching** - Efficient state management and API caching
- **Responsive Images** - Automatic image optimization
- **Fast Bundling** - Turbopack for lightning-fast development builds

## 🔒 Privacy & Security

- **Client-side Processing** - Thumbnails generated locally
- **Secure API Communication** - HTTPS-only in production
- **No Image Storage** - Images processed in memory only
- **Environment Variables** - Secure API key management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting
- Add comments for complex logic
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Hitarth** - *Full Stack Developer*

- GitHub: [@Hitarth](https://github.com/disuhitarth)
- LinkedIn: [Hitarth](https://linkedin.com/in/disuhitarth)

## 🙏 Acknowledgments

- Google Gemini AI team for the powerful image generation API
- Next.js team for the excellent React framework
- Tailwind CSS for the utility-first styling approach
- The open-source community for inspiration and tools

## 📈 Roadmap

- [ ] Batch processing for multiple images
- [ ] Custom AI model integration
- [ ] Advanced editing templates
- [ ] User authentication and image saving
- [ ] Collaboration features
- [ ] Mobile app version

---

<div align="center">
  <strong>Built with ❤️ using Next.js and Google Gemini AI</strong>
</div>
