// Post generation logic using AI

interface UserProfile {
  name: string
  bio: string
  focus: string
  tone: string
  examples: string[]
}

const userProfiles: Record<string, UserProfile> = {
  jeremiah: {
    name: 'Jeremiah Smith',
    bio: 'Founder & CEO of SimpleTiger',
    focus: 'Business strategy, AI, entrepreneurship, faith-driven leadership',
    tone: 'Balanced - professional when it matters, casual when it doesn\'t, always competent',
    examples: [
      'Most people think AI will replace agencies, but here\'s what I\'ve learned...',
      'The one question that changed how I approach client calls',
      'Why I hire slowly but fire fast (and you should too)',
    ]
  },
  sean: {
    name: 'Sean',
    bio: 'Marketing Professional',
    focus: 'Digital marketing, agencies, growth strategies',
    tone: 'Direct, practical, industry-focused',
    examples: [
      'I see a lot of businesses taking their marketing entirely in-house, and here\'s why that\'s short-sighted',
      'The 3 things that surprised me about scaling an agency',
      'Why most marketing teams fail at execution',
    ]
  }
}

const styleTemplates = {
  professional: {
    structure: 'Hook → Context → Insight → Takeaway',
    tone: 'Authoritative but approachable',
  },
  casual: {
    structure: 'Personal story → Lesson learned → Actionable advice',
    tone: 'Conversational and relatable',
  },
  'thought-leadership': {
    structure: 'Contrarian take → Supporting evidence → Future implications',
    tone: 'Bold and forward-thinking',
  },
  story: {
    structure: 'Narrative setup → Challenge/conflict → Resolution → Moral',
    tone: 'Engaging and human',
  },
  controversial: {
    structure: 'Bold statement → Defend position → Call for discussion',
    tone: 'Confident and debate-provoking',
  },
}

export async function generatePost(user: string, topic: string, style: string): Promise<string> {
  const profile = userProfiles[user]
  const template = styleTemplates[style as keyof typeof styleTemplates]

  if (!profile) {
    throw new Error('Invalid user profile')
  }

  // In a real implementation, this would call OpenAI, Claude, or similar AI service
  // For now, we'll create template-based posts
  
  const prompt = `
    Write a LinkedIn post for ${profile.name} about "${topic}".
    
    Style: ${style} (${template.structure})
    Tone: ${template.tone}
    
    Profile context:
    - Bio: ${profile.bio}
    - Focus areas: ${profile.focus}
    - Writing style: ${profile.tone}
    
    Examples of their previous posts:
    ${profile.examples.join('\n')}
    
    Requirements:
    - 150-300 words
    - Include specific insights or takeaways
    - Use line breaks for readability
    - End with a question or call to action
    - Match their authentic voice
  `

  // TODO: Replace with actual AI API call
  // const aiResponse = await callAIService(prompt)
  
  // For now, return a template-based post
  return generateTemplatePost(profile, topic, style, template)
}

function generateTemplatePost(
  profile: UserProfile, 
  topic: string, 
  style: string, 
  template: any
): string {
  const hooks = [
    `I've been thinking about ${topic} lately.`,
    `Here's an unpopular opinion about ${topic}:`,
    `Most people get ${topic} wrong.`,
    `Something interesting happened with ${topic} this week.`,
    `I see a lot of confusion around ${topic}.`
  ]

  const hook = hooks[Math.floor(Math.random() * hooks.length)]

  switch (style) {
    case 'professional':
      return `${hook}

The challenge isn't understanding ${topic} — it's applying it effectively.

Here's what I've learned:

• Context matters more than technique
• Simple approaches often outperform complex ones  
• Consistency beats perfection every time

The companies that succeed aren't necessarily the ones with the best strategy. They're the ones that execute consistently and adapt quickly.

What's been your experience with ${topic}? What approach has worked best for you?`

    case 'casual':
      return `Had a conversation about ${topic} yesterday that got me thinking...

${hook}

It reminded me of something that happened early in my career. I thought I understood ${topic}, but I was missing the bigger picture.

The real insight? It's not about having all the answers. It's about asking better questions and being willing to change course when the data tells you to.

Anyone else learned something surprising about ${topic} recently?`

    case 'thought-leadership':
      return `${hook}

While everyone's focused on the obvious aspects of ${topic}, they're missing the real opportunity.

Here's what's actually happening:

The fundamental assumptions we've built around ${topic} are changing. What worked 5 years ago doesn't just need tweaking — it needs rethinking.

The companies that recognize this shift early will have a massive advantage. The ones that don't will be playing catch-up for years.

What do you think? Are we on the verge of a major shift in how we approach ${topic}?`

    case 'controversial':
      return `Unpopular opinion: Most advice about ${topic} is wrong.

Here's why:

Everyone's optimizing for the same metrics, following the same playbook, and getting the same mediocre results.

The real opportunity isn't in doing ${topic} better — it's in questioning whether you should be doing it at all.

Sometimes the best strategy is to ignore conventional wisdom and find a completely different approach.

Disagree? Let's hear your take in the comments.`

    default:
      return `${hook}

Here's what I've learned about ${topic}:

It's more nuanced than most people realize. The surface-level advice you see everywhere only scratches the surface.

Real success comes from understanding the underlying principles, not just following tactics.

What's been your experience? What would you add?`
  }
}