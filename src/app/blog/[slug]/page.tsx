"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';
import { useState, useEffect } from 'react';
import { use } from 'react';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else if (response.status === 404) {
          setNotFoundError(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setNotFoundError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFoundError || !post) {
    notFound();
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
      </header>
      
      <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none mx-auto 
                      prose-headings:text-foreground 
                      prose-p:text-foreground/90 prose-p:leading-relaxed
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:text-foreground/90 prose-ol:text-foreground/90
                      prose-li:marker:text-primary prose-li:leading-relaxed
                      prose-img:rounded-lg prose-img:shadow-lg
                      prose-hr:border-border
                      prose-table:border-collapse prose-th:border prose-th:border-border prose-td:border prose-td:border-border
                      prose-thead:bg-muted/50">
        <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
          {post.content}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Posts
            </Link>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {post.author?.name && (
              <span>By {post.author.name}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}