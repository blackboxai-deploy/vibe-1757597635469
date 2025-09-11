import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, trackType } = body;

    if (!fileId || !trackType) {
      return NextResponse.json({
        success: false,
        error: 'File ID and track type are required'
      }, { status: 400 });
    }

    // Validate track type
    if (!['vocals', 'music', 'original'].includes(trackType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid track type. Must be vocals, music, or original'
      }, { status: 400 });
    }

    // Generate mock download URL (in production, this would be a secure signed URL)
    const downloadToken = btoa(`${fileId}-${trackType}-${Date.now()}`);
    const downloadUrl = `${request.nextUrl.origin}/api/download/file?token=${downloadToken}&type=${trackType}`;
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return NextResponse.json({
      success: true,
      downloadUrl,
      expiresAt,
      message: `Download URL generated for ${trackType} track`
    });

  } catch (error) {
    console.error('Download URL generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate download URL'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  const trackType = searchParams.get('trackType');

  if (!fileId || !trackType) {
    return NextResponse.json({
      success: false,
      error: 'File ID and track type are required'
    }, { status: 400 });
  }

  try {
    // Generate download URL
    const downloadToken = btoa(`${fileId}-${trackType}-${Date.now()}`);
    const downloadUrl = `${request.nextUrl.origin}/api/download/file?token=${downloadToken}&type=${trackType}`;
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return NextResponse.json({
      success: true,
      downloadUrl,
      expiresAt,
      message: `Download URL generated for ${trackType} track`
    });

  } catch (error) {
    console.error('Download URL generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate download URL'
    }, { status: 500 });
  }
}