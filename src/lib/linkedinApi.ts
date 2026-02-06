// LinkedIn API integration

interface PostToLinkedInParams {
  accessToken: string
  content: string
  imageUrl?: string
}

interface LinkedInPostResponse {
  success: boolean
  postId?: string
  error?: string
}

export async function postToLinkedIn({
  accessToken,
  content,
  imageUrl,
}: PostToLinkedInParams): Promise<LinkedInPostResponse> {
  try {
    // First, get the user's LinkedIn profile to get their person URN
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to get LinkedIn profile')
    }

    const profile = await profileResponse.json()
    const personUrn = profile.id

    let mediaAssetUrn: string | undefined

    // If there's an image, upload it first
    if (imageUrl) {
      mediaAssetUrn = await uploadImageToLinkedIn(accessToken, personUrn, imageUrl)
    }

    // Create the post
    const postData = {
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
          ...(mediaAssetUrn && {
            media: [
              {
                status: 'READY',
                media: mediaAssetUrn,
              },
            ],
          }),
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }

    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    })

    if (!postResponse.ok) {
      const errorData = await postResponse.json()
      throw new Error(`LinkedIn API error: ${JSON.stringify(errorData)}`)
    }

    const postId = postResponse.headers.get('X-RestLi-Id')

    return {
      success: true,
      postId,
    }
  } catch (error) {
    console.error('Error posting to LinkedIn:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function uploadImageToLinkedIn(
  accessToken: string,
  personUrn: string,
  imageUrl: string
): Promise<string> {
  // Register the upload
  const registerData = {
    registerUploadRequest: {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner: `urn:li:person:${personUrn}`,
      serviceRelationships: [
        {
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent',
        },
      ],
    },
  }

  const registerResponse = await fetch(
    'https://api.linkedin.com/v2/assets?action=registerUpload',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(registerData),
    }
  )

  if (!registerResponse.ok) {
    throw new Error('Failed to register image upload')
  }

  const registerResult = await registerResponse.json()
  const uploadUrl = registerResult.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl
  const asset = registerResult.value.asset

  // Download the image
  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error('Failed to download image')
  }

  const imageBlob = await imageResponse.blob()

  // Upload the image
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: imageBlob,
  })

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image to LinkedIn')
  }

  return asset
}

export async function getLinkedInProfile(accessToken: string) {
  try {
    const response = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get LinkedIn profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting LinkedIn profile:', error)
    throw error
  }
}