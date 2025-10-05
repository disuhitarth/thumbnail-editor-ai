import { NextRequest, NextResponse } from 'next/server';

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

    // Log the image size to console
    console.log('Image size:', image.size, 'bytes');
    console.log('Image name:', image.name);
    console.log('Image type:', image.type);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Image and prompt received successfully',
      imageSize: image.size,
      prompt: prompt
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}