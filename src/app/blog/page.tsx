import type { Metadata } from 'next';
// No longer need BlogPost type here if getAllBlogPosts returns the correct type
// import type { BlogPost } from '@/types'; 
import BlogPostCard from '@/components/ui/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/blog'; // Import the function to get posts

export const metadata: Metadata = {
  title: 'All Blog Posts | AJ-Playground',
  description: "Browse all blog posts from AJ-Playground, covering topics in web development, AI, and technology.",
};

export default function AllBlogPostsPage() {
  const allPosts = getAllBlogPosts(); // Fetch posts using the new function

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <header className="text-center mb-10 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
          AJ&apos;s Blog
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          All my thoughts on technology, development, and everything in between. Happy reading!
        </p>
      </header>

      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No blog posts yet. Stay tuned!</p>
          <p className="mt-2 text-sm text-muted-foreground">I&apos;m currently brewing up some new content.</p>
        </div>
      )}
    </div>
  );
}

