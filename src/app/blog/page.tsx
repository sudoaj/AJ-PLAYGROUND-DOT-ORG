import type { Metadata } from 'next';
import type { BlogPost } from '@/types';
import BlogPostCard from '@/components/ui/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Updated sample data to match BlogSection for consistency.
// In a real app, this would be fetched from a CMS or markdown files.
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

export const metadata: Metadata = {
  title: 'All Blog Posts | AJ-Playground',
  description: "Browse all blog posts from AJ-Playground, covering topics in web development, AI, and technology.",
};

export default function AllBlogPostsPage() {
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

      {sampleBlogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleBlogPosts.map((post) => (
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

