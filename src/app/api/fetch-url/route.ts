import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS URLs are allowed' },
        { status: 400 }
      );
    }

    // Fetch the URL content with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
          success: false 
        },
        { status: 400 }
      );
    }

    const contentType = response.headers.get('content-type');
    
    // Check if it's HTML content
    if (!contentType || !contentType.includes('text/html')) {
      return NextResponse.json(
        { 
          error: 'URL does not return HTML content',
          success: false 
        },
        { status: 400 }
      );
    }

    const html = await response.text();
    
    // Enhanced HTML parsing to extract text content
    // Remove script and style tags, and other non-content elements
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '') // Remove navigation
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '') // Remove headers
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '') // Remove footers
      .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, '') // Remove sidebars
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/<[^>]+>/g, ' ') // Remove all remaining HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Remove common noise text that appears on job sites
    const noisePatterns = [
      /apply now/gi,
      /save job/gi,
      /share this job/gi,
      /report this job/gi,
      /similar jobs/gi,
      /recommended jobs/gi,
      /sign in to apply/gi,
      /create account/gi,
      /privacy policy/gi,
      /terms of service/gi,
      /cookie policy/gi
    ];
    
    noisePatterns.forEach(pattern => {
      cleanText = cleanText.replace(pattern, '');
    });
    
    // Final cleanup
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    // If the content is too short, it might not be a valid job posting
    if (cleanText.length < 200) {
      return NextResponse.json(
        { 
          error: 'URL content appears to be too short to be a job posting',
          success: false,
          content: cleanText.substring(0, 500) + '...',
          length: cleanText.length,
          url: url,
          debug: {
            originalLength: html.length,
            contentType: contentType,
            extractedLength: cleanText.length
          }
        },
        { status: 400 }
      );
    }

    // Limit content length to avoid overwhelming the AI
    if (cleanText.length > 10000) {
      cleanText = cleanText.substring(0, 10000) + '...';
    }

    return NextResponse.json({
      success: true,
      content: cleanText,
      url: url,
      length: cleanText.length,
      contentType: contentType,
      extractedAt: new Date().toISOString(),
      preview: cleanText.substring(0, 300) + (cleanText.length > 300 ? '...' : '')
    });

  } catch (error: any) {
    console.error('URL fetch error:', error);
    
    let errorMessage = 'Failed to fetch URL content';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out - the URL took too long to respond';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Network error - unable to reach the URL';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Domain not found - please check the URL';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Connection refused - the server is not responding';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        success: false 
      },
      { status: 500 }
    );
  }
}
