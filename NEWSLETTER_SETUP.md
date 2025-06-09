# Newsletter Setup Guide

## Quick Setup

1. **Get a Resend API Key**:
   - Go to https://resend.com and sign up
   - Navigate to API Keys: https://resend.com/api-keys
   - Click "Create API Key"
   - Give it a name like "AJ Playground Newsletter"
   - Copy the generated key

2. **Add API Key to Environment**:
   ```bash
   # Edit the .env.local file
   echo "RESEND_API_KEY=your_actual_api_key_here" >> .env.local
   ```

3. **Set Up Domain (Optional but Recommended)**:
   - In Resend dashboard, go to "Domains"
   - Add your domain (e.g., aj-playground.com)
   - Follow DNS verification steps
   - Update the "from" email in `/src/app/api/newsletter/route.ts` to use your domain

## How It Works

When someone subscribes to your newsletter:

1. **User subscribes** via the footer form
2. **You get notified** at `dev.aj@icloud.com` with subscriber details
3. **Subscriber gets welcome email** with links to your content
4. **Feedback shown** to user (success/error messages)

## Testing

Without API key:
- Subscriptions will fail gracefully with a service error message
- The rest of the site continues to work normally

With API key:
- Run the test: `node test-newsletter.js`
- Or test manually at http://localhost:9002 (footer subscription form)

## Email Templates

The system sends two emails:

1. **Notification to You**: Simple notification with subscriber email and timestamp
2. **Welcome to Subscriber**: Branded welcome email with links to your content

Both emails are HTML formatted and mobile-friendly.

## Security Notes

- Email validation on both client and server
- Rate limiting handled by Resend
- Environment variables not committed to git
- Error handling for all failure cases

## Troubleshooting

- Check `.env.local` file exists and has correct API key
- Verify Resend account is active
- Check server console for detailed error messages
- Test with `curl` or the test script
