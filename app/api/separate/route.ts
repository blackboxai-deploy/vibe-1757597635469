import { NextRequest, NextResponse } from 'next/server';
import { ProcessingStatus } from '@/types/audio';

// Mock processing jobs storage (in production, use a proper database)
const processingJobs = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, qualityLevel = 'standard' } = body;

    if (!fileId) {
      return NextResponse.json({
        success: false,
        error: 'File ID is required'
      }, { status: 400 });
    }

    // Check if file is already processing or completed
    const existingJob = Array.from(processingJobs.values()).find(job => job.fileId === fileId);
    if (existingJob) {
      if (existingJob.status === ProcessingStatus.PROCESSING) {
        return NextResponse.json({
          success: false,
          error: 'File is already being processed'
        }, { status: 400 });
      }
      if (existingJob.status === ProcessingStatus.COMPLETED) {
        return NextResponse.json({
          success: false,
          error: 'File is already completed'
        }, { status: 400 });
      }
    }

    // Create processing job
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const job = {
      id: jobId,
      fileId,
      status: ProcessingStatus.PROCESSING,
      progress: 0,
      startedAt: new Date(),
      qualityLevel,
      currentStep: 'Initializing AI models...'
    };

    processingJobs.set(jobId, job);

    // Start background processing
    processFileInBackground(jobId, fileId, qualityLevel);

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Processing started successfully',
      estimatedTime: qualityLevel === 'fast' ? 30 : qualityLevel === 'high' ? 120 : 60
    });

  } catch (error) {
    console.error('Separation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to start separation process'
    }, { status: 500 });
  }
}

async function processFileInBackground(jobId: string, fileId: string, qualityLevel: string) {
  const job = processingJobs.get(jobId);
  if (!job) return;

  try {
    // Simulate processing stages
    const stages = [
      { step: 'Loading audio file...', progress: 10 },
      { step: 'Analyzing audio content...', progress: 25 },
      { step: 'Applying AI separation models...', progress: 50 },
      { step: 'Processing voice track...', progress: 70 },
      { step: 'Processing music track...', progress: 85 },
      { step: 'Finalizing output files...', progress: 95 }
    ];

    for (const stage of stages) {
      job.currentStep = stage.step;
      job.progress = stage.progress;
      processingJobs.set(jobId, job);
      
      // Wait between stages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Complete the job
    job.status = ProcessingStatus.COMPLETED;
    job.progress = 100;
    job.currentStep = 'Processing completed successfully!';
    job.completedAt = new Date();
    
    processingJobs.set(jobId, job);

  } catch (error) {
    job.status = ProcessingStatus.FAILED;
    job.error = error instanceof Error ? error.message : 'Unknown error';
    job.currentStep = 'Processing failed';
    processingJobs.set(jobId, job);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({
      success: false,
      error: 'Job ID is required'
    }, { status: 400 });
  }

  const job = processingJobs.get(jobId);
  
  if (!job) {
    return NextResponse.json({
      success: false,
      error: 'Job not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    job: {
      id: job.id,
      fileId: job.fileId,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      error: job.error
    }
  });
}