'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageHistoryItem {
  url: string;
  thumbnail: string;
  prompt: string;
  timestamp: number;
  type: 'original' | 'generated';
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [showPasteHint, setShowPasteHint] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageFromFileWithPrompt(file, "Original upload");
    }
  };

  const handleImageFromFileWithPrompt = async (file: File, prompt: string) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      console.log('Image loaded:', imageUrl.substring(0, 50) + '...');
      setSelectedImage(imageUrl);

      // Generate thumbnail for image
      const thumbnail = await generateThumbnail(imageUrl);

      // Add image to history with thumbnail
      setImageHistory([{
        url: imageUrl,
        thumbnail: thumbnail,
        prompt: prompt,
        timestamp: Date.now(),
        type: 'original'
      }]);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    const clipboardItems = e.clipboardData?.items;

    if (clipboardItems) {
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];

        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const file = new File([blob], 'pasted-image.png', { type: blob.type });
            await handleImageFromFileWithPrompt(file, "Pasted from clipboard");
            setResponse('📋 Image pasted from clipboard!');
            setShowPasteHint(false);
            break;
          }
        }
      }
    }
  };

  useEffect(() => {
    // Add paste event listener
    const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e);
    document.addEventListener('paste', handlePasteEvent);

    // Show paste hint on Ctrl/Cmd+V keydown
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !selectedImage) {
        setShowPasteHint(true);
        setTimeout(() => setShowPasteHint(false), 2000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('paste', handlePasteEvent);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const convertDataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const generateThumbnail = async (imageUrl: string, maxSize: number = 150): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.onload = () => {
        // Calculate thumbnail dimensions while maintaining aspect ratio
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress the image
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG for smaller file size
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnailDataUrl);
      };

      img.src = imageUrl;
    });
  };

  const handleHistoryClick = async (historyItem: ImageHistoryItem, index: number) => {
    setSelectedImage(historyItem.url);
    const file = await convertDataUrlToFile(historyItem.url, 'restored-image.png');
    setSelectedFile(file);
    setResponse(`🔄 Restored image from: "${historyItem.prompt}"`);

    // Pop the history stack to this point (remove everything after this index)
    setImageHistory(prev => prev.slice(0, index + 1));
  };

  const handleSubmit = async () => {
    if (!selectedFile || !instructions.trim()) {
      alert('Please provide both an image and instructions');
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('prompt', instructions);

      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.generatedImage) {
        setResponse(`✅ Success! Image processed (${Math.round(data.imageSize / 1024)}KB)`);
        console.log('Generated image received:', data.generatedImage.substring(0, 50) + '...');

        // Update current image to the generated result
        setSelectedImage(data.generatedImage);

        // Convert the generated image to a File for next iteration
        const generatedFile = await convertDataUrlToFile(data.generatedImage, 'generated-image.png');
        setSelectedFile(generatedFile);

        // Generate thumbnail for generated image
        const thumbnail = await generateThumbnail(data.generatedImage);

        // Add to history with thumbnail
        const newHistoryItem: ImageHistoryItem = {
          url: data.generatedImage,
          thumbnail: thumbnail,
          prompt: instructions,
          timestamp: Date.now(),
          type: 'generated'
        };
        console.log('Adding to history:', newHistoryItem.prompt, newHistoryItem.url.substring(0, 50) + '...');
        setImageHistory(prev => [...prev, newHistoryItem]);

        // Clear instructions for next iteration
        setInstructions("");

      } else if (data.success) {
        setResponse(`✅ Success! ${data.result}`);
      } else {
        setResponse(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`❌ Error: Failed to process request`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {!selectedImage ? (
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                ✨ Thumbnail Editor
              </h1>
              <p className="text-gray-600 mb-8">Upload an image or paste from clipboard to get started</p>
            </div>

            <div className="space-y-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 inline-block"
              >
                📤 Upload Thumbnail
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="text-gray-500 text-sm">
                or press <kbd className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">Ctrl+V</kbd> to paste an image
              </div>

              {showPasteHint && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm animate-pulse">
                  📋 Ready to paste! The image in your clipboard will be uploaded.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8 w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full">
              <div className="flex justify-center mb-6">
                <Image
                  src={selectedImage}
                  alt="Current thumbnail"
                  width={1200}
                  height={1200}
                  className="max-w-full h-auto object-contain rounded-xl shadow-md"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎨 Edit Instructions
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Describe how you want to edit this thumbnail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !instructions.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 disabled:scale-100 transition-all duration-200 text-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    "🚀 Process Image"
                  )}
                </button>

                {response && (
                  <div className={`p-4 rounded-lg text-center font-medium ${
                    response.includes('✅') || response.includes('🔄')
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {response}
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                    setInstructions("");
                    setResponse("");
                    setImageHistory([]);
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  🔄 Upload New Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image History Strip */}
      {imageHistory.length > 0 && (
        <div className="bg-white border-t shadow-lg p-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-3">📚 Image History ({imageHistory.length})</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {imageHistory.map((item, index) => (
                <div
                  key={item.timestamp}
                  onClick={() => handleHistoryClick(item, index)}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-200 group-hover:scale-105 bg-cover bg-center bg-no-repeat relative"
                      style={{
                        backgroundImage: `url(${item.thumbnail})`,
                        backgroundColor: item.thumbnail ? 'transparent' : '#f3f4f6'
                      }}
                    >
                      {/* Type indicator */}
                      <div className="absolute top-1 right-1 w-3 h-3 rounded-full border border-white shadow-sm">
                        <div className={`w-full h-full rounded-full ${
                          item.type === 'original' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-bold">
                        Restore
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 w-20 truncate text-center">
                    {item.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
