'use client'

import { useState, useEffect } from 'react'
import { Session } from 'next-auth'
import ImageGenerator from './ImageGenerator'

interface PostGeneratorProps {
  user: 'jeremiah' | 'sean'
  session: Session
}

interface GeneratedPost {
  content: string
  imageUrl?: string
  timestamp: string
}

export default function PostGenerator({ user, session }: PostGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([])
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('professional')
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null)

  // Load saved posts for this user
  useEffect(() => {
    const saved = localStorage.getItem(`posts_${user}`)
    if (saved) {
      setGeneratedPosts(JSON.parse(saved))
    }
  }, [user])

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`posts_${user}`, JSON.stringify(generatedPosts))
  }, [generatedPosts, user])

  const generatePost = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, topic, style }),
      })

      const data = await response.json()
      
      if (response.ok) {
        const newPost: GeneratedPost = {
          content: data.post,
          timestamp: new Date().toISOString(),
        }
        setCurrentPost(newPost)
        setGeneratedPosts(prev => [newPost, ...prev.slice(0, 9)]) // Keep last 10
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Failed to generate post:', error)
      alert('Failed to generate post. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const postToLinkedIn = async (post: GeneratedPost) => {
    setIsPosting(true)
    try {
      const response = await fetch('/api/post-to-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: post.content,
          imageUrl: post.imageUrl,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Successfully posted to LinkedIn!')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Failed to post to LinkedIn:', error)
      alert('Failed to post to LinkedIn. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Post copied to clipboard!')
  }

  const userProfiles = {
    jeremiah: {
      name: 'Jeremiah Smith',
      bio: 'Founder & CEO of SimpleTiger',
      focus: 'Business strategy, AI, entrepreneurship, faith-driven leadership',
    },
    sean: {
      name: 'Sean',
      bio: 'Marketing Professional',
      focus: 'Digital marketing, agencies, growth strategies',
    },
  }

  const profile = userProfiles[user]

  return (
    <div className="space-y-8">
      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h3>
        <p className="text-gray-600 mb-2">{profile.bio}</p>
        <p className="text-sm text-gray-500">Focus: {profile.focus}</p>
      </div>

      {/* Post Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Generate New Post</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic or Theme
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., AI in marketing, leadership lessons, industry trends"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="thought-leadership">Thought Leadership</option>
              <option value="story">Story/Narrative</option>
              <option value="controversial">Controversial Take</option>
            </select>
          </div>

          <button
            onClick={generatePost}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Post'}
          </button>
        </div>
      </div>

      {/* Current Post */}
      {currentPost && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Generated Post</h3>
            <span className="text-xs text-gray-500">
              {new Date(currentPost.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="whitespace-pre-wrap text-gray-900">{currentPost.content}</p>
          </div>

          {currentPost.imageUrl && (
            <div className="mb-4">
              <img
                src={currentPost.imageUrl}
                alt="Generated image"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}

          <ImageGenerator
            onImageGenerated={(imageUrl) => {
              setCurrentPost(prev => prev ? { ...prev, imageUrl } : null)
            }}
          />

          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => postToLinkedIn(currentPost)}
              disabled={isPosting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isPosting ? 'Posting...' : 'Post to LinkedIn'}
            </button>
            
            <button
              onClick={() => copyToClipboard(currentPost.content)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Copy Text
            </button>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://example.com')}&summary=${encodeURIComponent(currentPost.content)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Open LinkedIn
            </a>
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {generatedPosts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {generatedPosts.slice(0, 5).map((post, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm text-gray-600 truncate">{post.content.substring(0, 100)}...</p>
                <span className="text-xs text-gray-400">
                  {new Date(post.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}