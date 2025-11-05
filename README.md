# AI Social Media Agent

An AI-powered application that generates images and videos using AI models and uploads them to multiple social media platforms with a single click.

## Features

- **AI Image Generation**: Uses OpenAI's DALL-E 3 to create high-quality images
- **AI Video Generation**: Uses Replicate's Stable Video Diffusion for video creation
- **Multi-Platform Upload**: Upload to Twitter, Facebook, Instagram, LinkedIn, TikTok, and YouTube simultaneously
- **Beautiful UI**: Modern, responsive interface built with Next.js and Tailwind CSS
- **Real-time Status**: Track upload progress for each platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

Required API keys:
- `OPENAI_API_KEY`: For image generation (get from https://platform.openai.com/api-keys)
- `REPLICATE_API_TOKEN`: For video generation (get from https://replicate.com/account/api-tokens)

Optional (for social media uploads):
- Twitter/X API credentials
- Facebook/Instagram API credentials
- LinkedIn API credentials
- TikTok API credentials
- YouTube API credentials

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Generate Content**: Enter a text prompt describing what you want to create
2. **Choose Type**: Select whether to generate an image or video
3. **Create**: Click generate and the AI will create your content
4. **Select Platforms**: Choose which social media platforms to upload to
5. **Upload**: Click upload to post to all selected platforms at once

## API Credentials Setup

### OpenAI (Required for Images)
1. Sign up at https://platform.openai.com
2. Navigate to API keys
3. Create a new secret key
4. Add to `.env.local` as `OPENAI_API_KEY`

### Replicate (Required for Videos)
1. Sign up at https://replicate.com
2. Go to Account Settings > API tokens
3. Create a new token
4. Add to `.env.local` as `REPLICATE_API_TOKEN`

### Social Media APIs (Optional)
Each platform requires OAuth setup and API credentials. See their respective developer portals:
- Twitter: https://developer.twitter.com
- Facebook/Instagram: https://developers.facebook.com
- LinkedIn: https://www.linkedin.com/developers
- TikTok: https://developers.tiktok.com
- YouTube: https://console.cloud.google.com

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI Models**: OpenAI DALL-E 3, Replicate Stable Video Diffusion
- **Language**: TypeScript
- **Deployment**: Vercel

## License

MIT