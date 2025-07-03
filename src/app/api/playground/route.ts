import { NextRequest, NextResponse } from 'next/server';
import { getActivePlaygroundProjects } from '@/lib/playground';

export async function GET(request: NextRequest) {
  try {
    const projects = getActivePlaygroundProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching playground projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playground projects' },
      { status: 500 }
    );
  }
}
