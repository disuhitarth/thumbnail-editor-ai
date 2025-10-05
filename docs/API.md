# API Documentation

This document provides detailed information about the AI Thumbnail Editor API endpoints.

## Base URL

```
http://localhost:3000/api  (Development)
https://your-domain.com/api  (Production)
```

## Authentication

The API uses Google Gemini AI which requires an API key configured in environment variables. No user authentication is required for the current version.

## Endpoints

### POST /api/process

Process an image using AI-powered editing capabilities.

#### Request

**Content-Type:** `multipart/form-data`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | File | Yes | Image file to process (JPG, PNG, GIF, WebP) |
| `prompt` | string | Yes | Natural language instructions for image editing |

**Example Request:**

```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('prompt', 'change background to blue');

const response = await fetch('/api/process', {
  method: 'POST',
  body: formData,
});
```

#### Response

**Success Response (200 OK):**

```json
{
  "success": true,
  "generatedImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "imageSize": 12345,
  "prompt": "change background to blue",
  "result": "Image generation completed",
  "message": "Image processed successfully with Nano Banana"
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Missing image or prompt"
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "error": "API key not configured"
}
```

```json
{
  "error": "Processing failed: [detailed error message]"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the request was successful |
| `generatedImage` | string | Base64 data URL of the processed image |
| `imageSize` | number | Size of the original image in bytes |
| `prompt` | string | The prompt that was used for processing |
| `result` | string | Text description of the processing result |
| `message` | string | Success message |
| `error` | string | Error message (only in error responses) |

## Error Codes

| Code | Description | Possible Causes |
|------|-------------|----------------|
| 400 | Bad Request | Missing image or prompt parameter |
| 429 | Too Many Requests | Gemini API quota exceeded |
| 500 | Internal Server Error | API key not configured, processing failure |

## Rate Limits

The API is subject to Google Gemini AI rate limits:

- **Free Tier:** Limited requests per minute/day
- **Paid Tier:** Higher limits based on plan

When rate limits are exceeded, you'll receive a 429 error with retry information.

## Image Constraints

### Supported Formats
- JPEG/JPG
- PNG
- GIF
- WebP

### Size Limits
- Maximum file size: Determined by Gemini AI limits
- Recommended: Under 10MB for optimal performance

### Processing Time
- Typical response time: 5-30 seconds
- Complex edits may take longer
- Timeout: 60 seconds maximum

## Prompt Guidelines

### Effective Prompts
- Be specific and descriptive
- Use clear, simple language
- Specify colors, styles, or effects clearly

### Examples

**Background Changes:**
```
"change background to deep blue"
"remove background and make it transparent"
"add a gradient background from pink to purple"
```

**Text Modifications:**
```
"change text color to white"
"make the text bold and larger"
"add text saying 'Hello World' in red"
```

**Style Changes:**
```
"make it look more modern"
"apply a vintage filter"
"convert to black and white"
```

**Object Manipulation:**
```
"remove the person from the image"
"add a robot to the scene"
"make the logo bigger"
```

## Client-Side Integration

### JavaScript/TypeScript

```typescript
interface ProcessImageResponse {
  success: boolean;
  generatedImage?: string;
  imageSize: number;
  prompt: string;
  result: string;
  message?: string;
  error?: string;
}

async function processImage(
  imageFile: File,
  prompt: string
): Promise<ProcessImageResponse> {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('prompt', prompt);

  const response = await fetch('/api/process', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

### React Hook Example

```typescript
import { useState } from 'react';

function useImageProcessing() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (file: File, prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', prompt);

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { processImage, isLoading, error };
}
```

## Security Considerations

### API Key Protection
- Never expose the Gemini API key in client-side code
- Use environment variables for key storage
- Rotate keys regularly

### Input Validation
- All uploaded files are validated on the server
- Prompts are sanitized before processing
- File size limits are enforced

### Rate Limiting
- Implement client-side rate limiting for better UX
- Handle 429 responses gracefully
- Show appropriate error messages to users

## Future API Extensions

Planned enhancements for future versions:

### Authentication
- User registration and login
- API key management per user
- Usage tracking and quotas

### Batch Processing
- Process multiple images simultaneously
- Queue management for large batches
- Progress tracking for long operations

### Advanced Features
- Custom model selection
- Style presets and templates
- Image format conversion options