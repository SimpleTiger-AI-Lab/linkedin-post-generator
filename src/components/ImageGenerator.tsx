'use client'

import { useState } from 'react'

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void
}

export default function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const generateImage = async () => {
    if (!imagePrompt.trim()) return

    setIsGenerating(true)
    try {
      // For now, we'll use a placeholder. This will be replaced with actual image generation API
      // when we integrate with DALL-E, Midjourney, or similar service
      
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedImage(data.imageUrl)
        onImageGenerated(data.imageUrl)
      } else {
        // Fallback to placeholder for now
        const placeholderUrl = `https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=${encodeURIComponent(imagePrompt.substring(0, 30))}`
        setGeneratedImage(placeholderUrl)
        onImageGenerated(placeholderUrl)
      }
    } catch (error) {
      console.error('Failed to generate image:', error)
      // Use placeholder as fallback
      const placeholderUrl = `https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=${encodeURIComponent(imagePrompt.substring(0, 30))}`
      setGeneratedImage(placeholderUrl)
      onImageGenerated(placeholderUrl)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Prompt (Optional)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="e.g., Professional business meeting, modern office, AI concept"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={generateImage}
            disabled={isGenerating || !imagePrompt.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      </div>

      {generatedImage && (
        <div className="relative">
          <img
            src={generatedImage}
            alt="Generated image"
            className="max-w-full h-auto rounded-lg border"
          />
          <button
            onClick={() => {
              setGeneratedImage(null)
              onImageGenerated('')
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {!generatedImage && (
        <div className="text-sm text-gray-500">
          <p>💡 <strong>Note:</strong> Image generation will be integrated with your preferred AI image service (DALL-E, Midjourney, etc.)</p>
        </div>
      )}
    </div>
  )
}