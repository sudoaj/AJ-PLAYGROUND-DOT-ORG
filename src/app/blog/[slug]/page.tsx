import { getAllBlogPosts, getBlogPostBySlug, BlogPostWithContent } from '@/lib/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Assuming Badge might be styled like a button or is in the same dir.
// If Badge is not used or located elsewhere, this import can be removed or adjusted.
// import { Badge } from '@/components/ui/button'; 

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This blog post could not be found.',
    };
  }
  return {
    title: `${post.title} | AJ's Blog`,
    description: post.excerpt,
    openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date, // Ensure date is in ISO 8601 format for OGP
        images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
    twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.imageUrl ? [post.imageUrl] : [],
    }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound(); // Triggers the not-found page or behavior
  }

  // Format date for display
  let displayDate = post.date;
  try {
    displayDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    // Keep original date string if parsing fails
    console.warn(`Could not parse date for post "${post.title}": ${post.date}`);
  }


  return (
    <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3">
          {post.title}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Posted on {displayDate}
        </p>
        {/* Example for future use:
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
        */}
      </header>
      
      {/* Render the HTML content from markdown */}
      <div
        className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="my-12" />

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
            <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View More Posts
            </Link>
        </Button>
      </div>
    </article>
  );
}