import { NextRequest, NextResponse } from 'next/server'
import { generatePost } from '@/lib/postGenerator'

export async function POST(request: NextRequest) {
  try {
    const { user, topic, style } = await request.json()
    
    if (!user || !topic) {
      return NextResponse.json(
        { error: 'User and topic are required' },
        { status: 400 }
      )
    }

    const post = await generatePost(user, topic, style)
    
    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error generating post:', error)
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    )
  }
}