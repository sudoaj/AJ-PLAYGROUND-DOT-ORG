import { getAllBlogPosts } from '@/lib/blog';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const blogPosts = getAllBlogPosts();
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
