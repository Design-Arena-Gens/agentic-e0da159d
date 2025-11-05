'use client'

import { useState } from 'react'
import { Sparkles, Video, Image as ImageIcon, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

type ContentType = 'image' | 'video'
type Platform = 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube'

interface GenerationResult {
  url: string
  type: ContentType
}

interface UploadStatus {
  platform: Platform
  status: 'pending' | 'uploading' | 'success' | 'error'
  message?: string
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [contentType, setContentType] = useState<ContentType>('image')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [generatedContent, setGeneratedContent] = useState<GenerationResult | null>(null)
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const platforms: { id: Platform; name: string; icon: string }[] = [
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
  ]

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const generateContent = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedContent(null)
    setUploadStatuses([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: contentType }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Generation failed')
      }

      const data = await response.json()
      setGeneratedContent({ url: data.url, type: contentType })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const uploadToAll = async () => {
    if (!generatedContent || selectedPlatforms.length === 0) return

    setIsUploading(true)
    setUploadStatuses(
      selectedPlatforms.map(platform => ({
        platform,
        status: 'pending',
      }))
    )

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentUrl: generatedContent.url,
          contentType: generatedContent.type,
          platforms: selectedPlatforms,
          caption: prompt,
        }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadStatuses(data.results)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload content')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Social Media Agent
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Generate AI images & videos, upload to all platforms in one click
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <div className="flex gap-4">
              <button
                onClick={() => setContentType('image')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  contentType === 'image'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ImageIcon className="inline mr-2" size={20} />
                Image
              </button>
              <button
                onClick={() => setContentType('video')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  contentType === 'video'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Video className="inline mr-2" size={20} />
                Video
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Describe what you want to create
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A futuristic cityscape at sunset with flying cars..."
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              rows={4}
            />
          </div>

          <button
            onClick={generateContent}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="inline mr-2 animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="inline mr-2" size={20} />
                Generate {contentType === 'image' ? 'Image' : 'Video'}
              </>
            )}
          </button>
        </div>

        {generatedContent && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
            <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              {generatedContent.type === 'image' ? (
                <img
                  src={generatedContent.url}
                  alt="Generated"
                  className="w-full h-auto"
                />
              ) : (
                <video
                  src={generatedContent.url}
                  controls
                  className="w-full h-auto"
                />
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Select Platforms to Upload
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-xl mr-2">{platform.icon}</span>
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={uploadToAll}
              disabled={isUploading || selectedPlatforms.length === 0}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="inline mr-2 animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="inline mr-2" size={20} />
                  Upload to Selected Platforms
                </>
              )}
            </button>

            {uploadStatuses.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Upload Status</h3>
                <div className="space-y-2">
                  {uploadStatuses.map(status => (
                    <div
                      key={status.platform}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="font-medium capitalize">
                        {platforms.find(p => p.id === status.platform)?.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {status.status === 'pending' && (
                          <span className="text-gray-500">Pending...</span>
                        )}
                        {status.status === 'uploading' && (
                          <Loader2 className="animate-spin text-blue-500" size={20} />
                        )}
                        {status.status === 'success' && (
                          <CheckCircle className="text-green-500" size={20} />
                        )}
                        {status.status === 'error' && (
                          <XCircle className="text-red-500" size={20} />
                        )}
                        {status.message && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {status.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
