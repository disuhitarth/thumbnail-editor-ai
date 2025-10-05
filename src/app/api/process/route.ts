import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Missing image or prompt' },
        { status: 400 }
      );
    }

    // Log the prompt to console
    console.log('User prompt:', prompt);
    console.log('Image size:', image.size, 'bytes');
    console.log('Image name:', image.name);
    console.log('Image type:', image.type);

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Convert image to base64
    const imageBuffer = await image.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Prepare the content for Gemini
    const content = [
      {
        text: `Please edit this image according to the following instructions: ${prompt}`,
      },
      {
        inlineData: {
          mimeType: image.type,
          data: imageBase64,
        },
      },
    ];

    console.log('Sending request to Gemini API...');

    // Generate content with Gemini
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: content,
    });

    console.log('Received response from Gemini API');

    // Extract generated image from response
    let generatedImageBase64 = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    // Return success response with generated image
    return NextResponse.json({
      success: true,
      message: 'Image processed successfully with Nano Banana',
      imageSize: image.size,
      prompt: prompt,
      result: response.text || 'Image generation completed',
      generatedImage: generatedImageBase64 ? `data:image/png;base64,${generatedImageBase64}` : null,
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}