import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!resend) {
      console.log(`Newsletter subscription attempt: ${email} (Resend not configured)`);
      return NextResponse.json(
        { error: 'Newsletter service is not configured. Please try again later.' },
        { status: 503 }
      );
    }

    // Send notification email to you
    await resend.emails.send({
      from: 'AJ Playground <noreply@aj-playground.com>', // You'll need to set up a domain with Resend
      to: ['dev.aj@icloud.com'],
      subject: 'New Newsletter Subscription!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Newsletter Subscription</h2>
          <p>Someone just subscribed to your newsletter!</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #666;">Subscriber Details:</h3>
            <p style="margin: 10px 0 0 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;"><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            This notification was sent from your AJ Playground website.
          </p>
        </div>
      `,
    });

    // Send welcome email to the subscriber
    await resend.emails.send({
      from: 'AJ from AJ Playground <noreply@aj-playground.com>',
      to: [email],
      subject: 'Welcome to AJ Playground Newsletter! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to AJ Playground! 🚀</h2>
          <p>Hey there!</p>
          <p>Thanks for subscribing to my newsletter. I'm excited to have you on board!</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">What to expect:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              <li>Updates on new projects and experiments</li>
              <li>Behind-the-scenes insights on my coding journey</li>
              <li>AI and tech discoveries I find interesting</li>
              <li>Occasional life reflections and thoughts</li>
            </ul>
          </div>
          
          <p>While you're here, feel free to explore:</p>
          <ul>
            <li><a href="https://aj-playground.com/projects" style="color: #3b82f6;">My Projects</a> - See what I've been building</li>
            <li><a href="https://aj-playground.com/playground" style="color: #3b82f6;">The Playground</a> - Interactive experiments</li>
            <li><a href="https://aj-playground.com/blog" style="color: #3b82f6;">Blog Posts</a> - My thoughts and tutorials</li>
          </ul>
          
          <p style="margin-top: 30px;">
            Thanks again for joining the journey!<br>
            <strong>AJ</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 12px;">
            You can unsubscribe anytime by replying to this email with "unsubscribe" in the subject line.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
