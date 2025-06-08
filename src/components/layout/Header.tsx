// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Download, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { BlogPost } from '@/types';

// Sample projects data for dropdown (should match the data from other components)
const sampleProjects = [
  { name: 'E-commerce Platform', slug: 'e-commerce-platform' },
  { name: 'AI Powered Chatbot', slug: 'ai-powered-chatbot' },
  { name: 'Data Visualization Dashboard', slug: 'data-visualization-dashboard' },
  { name: 'Security Logger', slug: 'security-logger' },
  { name: 'Mobile Task Manager', slug: 'mobile-task-manager' },
  { name: 'Cloud File Storage', slug: 'cloud-file-storage' },
];

// Sample blog posts for dropdown (in a real app, this would come from an API route)
const sampleBlogPosts: BlogPost[] = [
  {
    id: 'server-components',
    slug: 'server-components',
    title: 'Understanding React Server Components',
    date: '2024-04-02',
    excerpt: 'A look into React Server Components, their benefits, and how they are changing the way we build React applications.',
    imageUrl: '/images/blog/server-components-flow.png',
    imageHint: 'React Server Components Data Flow'
  },
  {
    id: 'why-react',
    slug: 'why-react', 
    title: 'Why React is a Great Choice for Modern Web Development',
    date: '2024-03-15',
    excerpt: 'Exploring the reasons behind React\'s popularity and its benefits for building dynamic user interfaces.',
    imageUrl: '/images/blog/react-logo.png',
    imageHint: 'React Logo'
  }
];

const navLinks = [
  { href: '/projects', label: 'Projects', hasDropdown: true },
  { href: '/blog', label: 'Blog', hasDropdown: true },
  { href: '/playground', label: 'Playground', hasDropdown: false },
];

export default function Header() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to create project slugs
  const slugify = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const renderNavItem = (link: typeof navLinks[0]) => {
    if (!link.hasDropdown) {
      return (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          {link.label}
        </Link>
      );
    }

    if (link.label === 'Projects') {
      return (
        <DropdownMenu key={link.href}>
          <DropdownMenuTrigger className="flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {link.label}
            <ChevronDown className="ml-1 h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/projects" className="w-full">
                View All Projects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {sampleProjects.slice(0, 5).map((project) => (
              <DropdownMenuItem key={project.slug} asChild>
                <Link href={`/projects/${project.slug}`} className="w-full">
                  {project.name}
                </Link>
              </DropdownMenuItem>
            ))}
            {sampleProjects.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/projects" className="w-full text-muted-foreground">
                    View More...
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (link.label === 'Blog') {
      return (
        <DropdownMenu key={link.href}>
          <DropdownMenuTrigger className="flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {link.label}
            <ChevronDown className="ml-1 h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/blog" className="w-full">
                View All Posts
              </Link>
            </DropdownMenuItem>
            {sampleBlogPosts.length > 0 && <DropdownMenuSeparator />}
            {sampleBlogPosts.slice(0, 5).map((post) => (
              <DropdownMenuItem key={post.slug} asChild>
                <Link href={`/blog/${post.slug}`} className="w-full">
                  {post.title}
                </Link>
              </DropdownMenuItem>
            ))}
            {sampleBlogPosts.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="w-full text-muted-foreground">
                    View More...
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  const commonNavItems = (
    <>
      {navLinks.map(renderNavItem)}
      <Button variant="outline" size="sm" asChild>
        <Link href="/resume">
          <Download className="mr-2 h-4 w-4" />
          Resume
        </Link>
      </Button>
    </>
  );
  
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            AJ's Playground
          </Link>
          {/* Skeleton for nav items */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="h-6 w-16 animate-pulse rounded-md bg-muted/50"></div>
            <div className="h-6 w-12 animate-pulse rounded-md bg-muted/50"></div>
            <div className="h-6 w-20 animate-pulse rounded-md bg-muted/50"></div>
            <div className="h-9 w-28 animate-pulse rounded-md bg-muted/50"></div>
          </div>
          <div className="md:hidden h-8 w-8 animate-pulse rounded-md bg-muted/50"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="pl-6 pr-6 py-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
        >
          AJ's Playground
        </Link>
        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background">
              <SheetHeader className="p-6 pb-0">
                <SheetTitle className="text-left text-lg font-semibold">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-6 p-6 pt-4">
                {navLinks.map((link) => {
                  if (!link.hasDropdown) {
                    return (
                      <Button key={link.href} variant="ghost" asChild className="justify-start">
                        <Link href={link.href} onClick={() => setIsSheetOpen(false)}>
                          {link.label}
                        </Link>
                      </Button>
                    );
                  }
                  
                  if (link.label === 'Projects') {
                    return (
                      <div key={link.href} className="space-y-2">
                        <Button variant="ghost" asChild className="justify-start w-full">
                          <Link href="/projects" onClick={() => setIsSheetOpen(false)}>
                            All Projects
                          </Link>
                        </Button>
                        <div className="pl-4 space-y-1">
                          {sampleProjects.slice(0, 3).map((project) => (
                            <Button key={project.slug} variant="ghost" size="sm" asChild className="justify-start w-full text-xs">
                              <Link href={`/projects/${project.slug}`} onClick={() => setIsSheetOpen(false)}>
                                {project.name}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  if (link.label === 'Blog') {
                    return (
                      <div key={link.href} className="space-y-2">
                        <Button variant="ghost" asChild className="justify-start w-full">
                          <Link href="/blog" onClick={() => setIsSheetOpen(false)}>
                            All Blog Posts
                          </Link>
                        </Button>
                        <div className="pl-4 space-y-1">
                          {sampleBlogPosts.slice(0, 3).map((post) => (
                            <Button key={post.slug} variant="ghost" size="sm" asChild className="justify-start w-full text-xs">
                              <Link href={`/blog/${post.slug}`} onClick={() => setIsSheetOpen(false)}>
                                {post.title}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  return null;
                })}
                <Button variant="outline" asChild>
                  <Link href="/resume" onClick={() => setIsSheetOpen(false)}>
                    <Download className="mr-2 h-4 w-4" />
                    Resume
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center space-x-6">
            {commonNavItems}
          </nav>
        )}
      </div>
    </header>
  );
}

