'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="text-primary hover:text-black/80">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Previous Page
        </Button>
      </div>
      
      <header className="text-center mb-10 md:mb-12">
        {/* Bouncy 404 Emoji */}
        <div className="text-8xl md:text-9xl mb-4 animate-bounce">
          🚫
        </div>
        
        {/* Large 404 Text */}
        <div className="text-6xl md:text-7xl font-extrabold text-foreground/80 mb-4 select-none">
          404
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
          Page Not Found
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Oops! The page you're looking for doesn't exist. Let's get you back on track!
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Error Card */}
        <Card className="mb-8 border-red-500/20 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-3xl">
                🚫
              </div>
            <Badge variant="destructive" className="text-xs shrink-0">
                Error 404
            </Badge>
            </div>
            <CardTitle className="text-lg leading-tight text-red-800 dark:text-red-200">
              Missing Page
            </CardTitle>
            <CardDescription className="text-sm text-red-700 dark:text-red-300">
              The page you're looking for might have been moved, deleted, or you entered the wrong URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              Page Unavailable
            </div>
          </CardContent>
        </Card>

        {/* Navigation Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Home Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    🏠
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Main
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  Home
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Return to the main page
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" variant="outline" asChild className="group/btn w-full">
                  <Link href="/">
                    <Home className="mr-2 h-3 w-3" />
                    Go Home
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Projects Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    🚀
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Portfolio
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  Projects
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  View my project portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" variant="outline" asChild className="group/btn w-full">
                  <Link href="/projects">
                    Explore Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Blog Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    📝
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Content
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  Blog
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Read my latest blog posts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" variant="outline" asChild className="group/btn w-full">
                  <Link href="/blog">
                    Read Blog
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Playground Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    🎮
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    Interactive
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  Playground
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Interactive experiments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" variant="outline" asChild className="group/btn w-full">
                  <Link href="/playground">
                    Try Playground
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
