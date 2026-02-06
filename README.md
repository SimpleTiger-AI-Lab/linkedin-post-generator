# LinkedIn Post Generator

A Next.js application for generating and scheduling LinkedIn posts with AI assistance. Features separate profiles for different users, LinkedIn OAuth integration, and AI-powered post generation.

## Features

- 🔐 LinkedIn OAuth authentication
- 👥 Multiple user profiles (Jeremiah & Sean)
- 🤖 AI-powered post generation
- 🎨 AI image generation (placeholder ready)
- 📅 Post scheduling and management
- 📱 Responsive design
- 🚀 One-click posting to LinkedIn!

## Getting Started

### 1. LinkedIn App Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Add these redirect URLs:
   - `http://localhost:3000/api/auth/callback/linkedin` (development)
   - `https://your-app.vercel.app/api/auth/callback/linkedin` (production)
4. Request the `w_member_social` permission for posting
5. Note your Client ID and Client Secret

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your environment variables:
- `LINKEDIN_CLIENT_ID`: From LinkedIn app
- `LINKEDIN_CLIENT_SECRET`: From LinkedIn app  
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Automatic Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
vercel --prod
```

## Adding Image Generation

The app is ready for AI image generation integration. Currently uses placeholders.

To integrate with DALL-E:

1. Add `OPENAI_API_KEY` to environment variables
2. Uncomment the OpenAI code in `/src/app/api/generate-image/route.ts`
3. Install OpenAI SDK: `npm install openai`

Other supported services:
- Stability AI
- Midjourney API
- Google Imagen

## User Profiles

### Jeremiah Smith
- Focus: Business strategy, AI, entrepreneurship, faith-driven leadership
- Tone: Balanced - professional when it matters, casual when it doesn't
- Style: Thought leadership and strategic insights

### Sean
- Focus: Digital marketing, agencies, growth strategies  
- Tone: Direct, practical, industry-focused
- Style: Tactical advice and industry perspectives

## Post Generation Styles

- **Professional**: Authoritative but approachable
- **Casual**: Conversational and relatable
- **Thought Leadership**: Bold and forward-thinking
- **Story**: Engaging narratives with lessons
- **Controversial**: Debate-provoking takes

## API Endpoints

- `POST /api/generate-post` - Generate AI post content
- `POST /api/generate-image` - Generate AI images
- `POST /api/post-to-linkedin` - Post to LinkedIn via API
- `/api/auth/[...nextauth]` - Authentication handlers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js + LinkedIn OAuth
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

<!-- Deployment trigger: 2026-02-06T02:45:24.263Z -->