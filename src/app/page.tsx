'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import PostGenerator from '@/components/PostGenerator'
import LoginButton from '@/components/LoginButton'

type User = 'jeremiah' | 'sean'

export default function Home() {
  const { data: session, status } = useSession()
  const [activeUser, setActiveUser] = useState<User>('jeremiah')

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-8">
          Welcome to LinkedIn Post Generator
        </h2>
        <p className="text-gray-600 mb-8">
          Generate engaging LinkedIn posts with AI and schedule them automatically.
        </p>
        <LoginButton />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* User Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['jeremiah', 'sean'].map((user) => (
              <button
                key={user}
                onClick={() => setActiveUser(user as User)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeUser === user
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {user}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Post Generator */}
      <PostGenerator user={activeUser} session={session} />

      {/* Logout */}
      <div className="mt-8 text-center">
        <button
          onClick={() => signOut()}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}