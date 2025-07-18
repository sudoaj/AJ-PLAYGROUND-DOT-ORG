"use client";

import type { Metadata } from 'next';
import type { BlogPost } from '@/types';
import BlogPostCard from '@/components/ui/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

// Since this is now a client component, we'll handle metadata differently
// export const metadata: Metadata = {
//   title: 'All Blog Posts | AJ-Playground',
//   description: "Browse all blog posts from AJ-Playground, covering topics in web development, AI, and technology.",
// };

export default function AllBlogPostsPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          setAllPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black/80">
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
          <p className="text-lg text-muted-foreground mt-4">
            Loading posts...
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black/80">
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

