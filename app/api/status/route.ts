import { NextRequest, NextResponse } from 'next/server';

// Mock status storage (in production, use a proper database)
const statusStorage = new Map<string, any>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  const jobId = searchParams.get('jobId');

  if (!fileId && !jobId) {
    return NextResponse.json({
      success: false,
      error: 'Either fileId or jobId is required'
    }, { status: 400 });
  }

  try {
    // For demo purposes, simulate different statuses based on time
    const now = Date.now();
    const key = fileId || jobId || 'unknown';
    
    // Check if we have stored status for this file/job
    let storedStatus = statusStorage.get(key);
    
    if (!storedStatus) {
      // Initialize new status
      storedStatus = {
        fileId: fileId,
        jobId: jobId,
        startTime: now,
        status: 'processing',
        progress: 0,
        currentStep: 'Initializing...'
      };
      statusStorage.set(key, storedStatus);
    }

    // Simulate processing progression
    const elapsed = now - storedStatus.startTime;
    const processingDuration = 8000; // 8 seconds total for demo
    
    if (elapsed < processingDuration) {
      // Still processing
      const progressPercent = Math.min((elapsed / processingDuration) * 100, 95);
      
      let currentStep = 'Initializing...';
      if (progressPercent > 20) currentStep = 'Analyzing audio...';
      if (progressPercent > 40) currentStep = 'Applying AI models...';
      if (progressPercent > 60) currentStep = 'Separating tracks...';
      if (progressPercent > 80) currentStep = 'Finalizing...';
      
      storedStatus.progress = Math.round(progressPercent);
      storedStatus.currentStep = currentStep;
      storedStatus.status = 'processing';
    } else {
      // Processing complete
      storedStatus.progress = 100;
      storedStatus.currentStep = 'Processing completed successfully!';
      storedStatus.status = 'completed';
      storedStatus.completedAt = new Date();
    }

    statusStorage.set(key, storedStatus);

    return NextResponse.json({
      success: true,
      progress: {
        fileId: storedStatus.fileId,
        status: storedStatus.status,
        progress: storedStatus.progress,
        currentStep: storedStatus.currentStep,
        estimatedTimeRemaining: storedStatus.status === 'completed' ? 0 : 
          Math.max(0, Math.round((processingDuration - elapsed) / 1000))
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get status'
    }, { status: 500 });
  }
}