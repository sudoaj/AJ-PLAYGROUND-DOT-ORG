import type { BlogPost } from '@/types';
import BlogPostCard from '@/components/ui/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Why React is My Go-To Library',
    date: '2024',
    imageUrl: 'https://picsum.photos/seed/react/400/225',
    imageHint: 'abstract code',
    slug: 'why-react',
    excerpt: 'An in-depth look at why React continues to be a dominant force in web development and my personal favorite for building modern UIs.',
  },
  {
    id: '2',
    title: 'The Rise of Server Components',
    date: '2023',
    imageUrl: 'https://picsum.photos/seed/server/400/225',
    imageHint: 'cloud architecture',
    slug: 'server-components',
    excerpt: 'Exploring the paradigm shift with server components in Next.js and how they are changing the way we build web applications.',
  },
  {
    id: '3',
    title: 'Mastering TypeScript for Large Scale Apps',
    date: '2022',
    imageUrl: 'https://picsum.photos/seed/typescript/400/225',
    imageHint: 'geometric pattern',
    slug: 'mastering-typescript',
    excerpt: 'Tips and tricks for leveraging TypeScript effectively in large-scale projects to improve code quality and maintainability.',
  },
  {
    id: '4',
    title: 'Deep Dive into Next.js App Router',
    date: '2024',
    imageUrl: 'https://picsum.photos/seed/nextjs/400/225',
    imageHint: 'futuristic interface',
    slug: 'nextjs-app-router',
    excerpt: 'A comprehensive guide to understanding and utilizing the Next.js App Router for optimal performance and developer experience.',
  },
  {
    id: '5',
    title: 'State Management in Modern React',
    date: '2023',
    imageUrl: 'https://picsum.photos/seed/statemgmt/400/225',
    imageHint: 'connected nodes',
    slug: 'react-state-management',
    excerpt: 'Comparing various state management solutions in React, from Context API to Zustand and Redux Toolkit.',
  },
];

export default function BlogSection() {
  // Display a subset of blog posts for the homepage section
  const displayedBlogPosts = sampleBlogPosts.slice(0, 3);

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
        {sampleBlogPosts.length > displayedBlogPosts.length && (
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

