import type { BlogPost } from '@/types';
import BlogPostCard from '@/components/ui/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/blog'; // Import the new function

export default function BlogSection() {
  const allPosts = getAllBlogPosts(); // Fetch all posts
  // Display a subset of blog posts for the homepage section
  const displayedBlogPosts = allPosts.slice(0, 3);

  return (
    <section id="blog" className="py-16 md:py-24 bg-background/90 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Blog
        </h2>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Thoughts on technology, development, and everything in between.
        </p>
        {displayedBlogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBlogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No blog posts yet. Stay tuned!</p>
        )}
        {allPosts.length > displayedBlogPosts.length && (
           <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

