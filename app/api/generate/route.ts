import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Replicate from 'replicate'

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Prompt and type are required' },
        { status: 400 }
      )
    }

    if (type === 'image') {
      return await generateImage(prompt)
    } else if (type === 'video') {
      return await generateVideo(prompt)
    } else {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    )
  }
}

async function generateImage(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.' },
      { status: 500 }
    )
  }

  const openai = new OpenAI({ apiKey })

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  })

  const imageUrl = response.data?.[0]?.url

  if (!imageUrl) {
    throw new Error('Failed to generate image')
  }

  return NextResponse.json({ url: imageUrl, type: 'image' })
}

async function generateVideo(prompt: string) {
  const apiToken = process.env.REPLICATE_API_TOKEN

  if (!apiToken) {
    return NextResponse.json(
      { error: 'Replicate API token not configured. Please set REPLICATE_API_TOKEN in environment variables.' },
      { status: 500 }
    )
  }

  const replicate = new Replicate({ auth: apiToken })

  // Using Stable Video Diffusion model
  const output = await replicate.run(
    "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
    {
      input: {
        input_image: await generateImageForVideo(prompt),
        sizing_strategy: "maintain_aspect_ratio",
        frames_per_second: 6,
        motion_bucket_id: 127,
      }
    }
  ) as unknown as string

  if (!output) {
    throw new Error('Failed to generate video')
  }

  return NextResponse.json({ url: output, type: 'video' })
}

async function generateImageForVideo(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key required for video generation')
  }

  const openai = new OpenAI({ apiKey })

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `A single frame suitable for video generation: ${prompt}`,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  })

  const imageUrl = response.data?.[0]?.url

  if (!imageUrl) {
    throw new Error('Failed to generate seed image for video')
  }

  return imageUrl
}
