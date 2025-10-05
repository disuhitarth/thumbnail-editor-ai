'use client';

import Image from "next/image";
import { useState } from "react";

interface ImageHistoryItem {
  url: string;
  prompt: string;
  timestamp: number;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        // Add initial image to history
        setImageHistory([{
          url: imageUrl,
          prompt: "Original upload",
          timestamp: Date.now()
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertDataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleHistoryClick = async (historyItem: ImageHistoryItem) => {
    setSelectedImage(historyItem.url);
    const file = await convertDataUrlToFile(historyItem.url, 'restored-image.png');
    setSelectedFile(file);
    setResponse(`🔄 Restored image from: "${historyItem.prompt}"`);
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

        // Update current image to the generated result
        setSelectedImage(data.generatedImage);

        // Convert the generated image to a File for next iteration
        const generatedFile = await convertDataUrlToFile(data.generatedImage, 'generated-image.png');
        setSelectedFile(generatedFile);

        // Add to history
        const newHistoryItem: ImageHistoryItem = {
          url: data.generatedImage,
          prompt: instructions,
          timestamp: Date.now()
        };
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
              <p className="text-gray-600 mb-8">Upload an image to get started</p>
            </div>

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
                  onClick={() => handleHistoryClick(item)}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    <Image
                      src={item.url}
                      alt={`History ${index + 1}`}
                      width={120}
                      height={120}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-200 group-hover:scale-105"
                    />
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
