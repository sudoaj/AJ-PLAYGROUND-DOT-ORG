// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Download, ChevronDown, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BlogPost, PlaygroundProject, Project } from '@/types';
import { AuthButton } from '@/components/auth/AuthButton';

const navLinks = [
  { href: '/projects', label: 'Projects', hasDropdown: true },
  { href: '/blog', label: 'Blog', hasDropdown: true },
  { href: '/playground', label: 'Playground', hasDropdown: true },
];

export default function Header() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [playgroundProjects, setPlaygroundProjects] = useState<PlaygroundProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [session]);

  const loadData = async () => {
    try {
      const [projectsResponse, postsResponse] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/posts')
      ]);

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setBlogPosts(postsData);
      }

      // Only load playground projects if user is authenticated
      if (session) {
        try {
          const playgroundResponse = await fetch('/api/playground', {
            headers: {
              'Authorization': `Bearer ${session.user?.email}`,
            },
          });
          if (playgroundResponse.ok) {
            const playgroundData = await playgroundResponse.json();
            setPlaygroundProjects(playgroundData);
          }
        } catch (error) {
          console.error('Error loading playground data:', error);
          // Set empty array if authentication fails
          setPlaygroundProjects([]);
        }
      } else {
        setPlaygroundProjects([]);
      }
    } catch (error) {
      console.error('Error loading navigation data:', error);
    } finally {
      setIsLoading(false);
    }
};

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
            {projects.slice(0, 5).map((project) => (
              <DropdownMenuItem key={project.slug} asChild>
                <Link href={`/projects/${project.slug}`} className="w-full">
                  {project.title}
                </Link>
              </DropdownMenuItem>
            ))}
            {projects.length > 5 && (
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
            {blogPosts.length > 0 && <DropdownMenuSeparator />}
            {blogPosts.slice(0, 5).map((post) => (
              <DropdownMenuItem key={post.slug} asChild>
                <Link href={`/blog/${post.slug}`} className="w-full">
                  {post.title}
                </Link>
              </DropdownMenuItem>
            ))}
            {blogPosts.length > 5 && (
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

    if (link.label === 'Playground') {
      return (
        <DropdownMenu key={link.href}>
          <DropdownMenuTrigger className="flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {link.label}
            {!session && <Lock className="ml-1 h-3 w-3" />}
            {session && <ChevronDown className="ml-1 h-3 w-3" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {!session ? (
              <>
                <div className="p-3 text-center text-sm text-muted-foreground">
                  <Lock className="mx-auto mb-2 h-6 w-6" />
                  <p>Sign in to access playground projects</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/signin" className="w-full">
                    Sign In to Continue
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/playground" className="w-full">
                    View All Projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {playgroundProjects.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {playgroundProjects.slice(0, 4).map((project) => (
                        <DropdownMenuItem key={project.slug} asChild className="p-2">
                          <Link href={`/playground/${project.slug}`} className="w-full flex items-center gap-2 text-sm">
                            <span className="text-lg">{project.emoji}</span>
                            <span className="truncate">{project.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    {playgroundProjects.length > 4 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/playground" className="w-full text-muted-foreground">
                            View More Playground...
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                ) : (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    <p>No playground projects yet</p>
                  </div>
                )}
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
      <AuthButton />
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
                          {projects.slice(0, 3).map((project) => (
                            <Button key={project.slug} variant="ghost" size="sm" asChild className="justify-start w-full text-xs">
                              <Link href={`/projects/${project.slug}`} onClick={() => setIsSheetOpen(false)}>
                                {project.title}
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
                          {blogPosts.slice(0, 3).map((post) => (
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

                  if (link.label === 'Playground') {
                    return (
                      <div key={link.href} className="space-y-2">
                        <Button variant="ghost" asChild className="justify-start w-full">
                          <Link href="/playground" onClick={() => setIsSheetOpen(false)}>
                            All Playground
                          </Link>
                        </Button>
                        <div className="pl-4 space-y-1">
                          {playgroundProjects.slice(0, 4).map((project) => (
                            <Button key={project.slug} variant="ghost" size="sm" asChild className="justify-start w-full text-xs">
                              <Link href={`/playground/${project.slug}`} onClick={() => setIsSheetOpen(false)}>
                                <span className="mr-2">{project.emoji}</span>
                                {project.title}
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
                <div className="pt-4 border-t">
                  <AuthButton />
                </div>
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

