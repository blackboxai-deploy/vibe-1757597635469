import { NextRequest, NextResponse } from 'next/server';
import { AudioFile, ProcessingStatus } from '@/types/audio';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SUPPORTED_FORMATS = [
  'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4', 'audio/aac', 'audio/ogg',
  'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File size too large. Maximum allowed: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      }, { status: 400 });
    }

    // For demo purposes, we'll accept any file type and create a mock AudioFile
    const timestamp = Date.now();
    const fileId = `${timestamp}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Create AudioFile object
    const audioFile: AudioFile = {
      id: fileId,
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      originalName: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: new Date(),
      status: ProcessingStatus.QUEUED,
      duration: Math.floor(Math.random() * 300) + 60, // Mock duration 1-5 minutes
    };

    return NextResponse.json({
      success: true,
      file: audioFile,
      message: 'File uploaded successfully and queued for processing'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Upload endpoint ready',
    limits: {
      maxFileSize: MAX_FILE_SIZE,
      supportedFormats: SUPPORTED_FORMATS
    }
  });
}