import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { postToLinkedIn } from '@/lib/linkedinApi'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with LinkedIn' },
        { status: 401 }
      )
    }

    const { content, imageUrl } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      )
    }

    const result = await postToLinkedIn({
      accessToken: session.accessToken as string,
      content,
      imageUrl,
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error posting to LinkedIn:', error)
    return NextResponse.json(
      { error: 'Failed to post to LinkedIn' },
      { status: 500 }
    )
  }
}