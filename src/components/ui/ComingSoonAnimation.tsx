'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock } from 'lucide-react';

interface ComingSoonAnimationProps {
  title: string;
  emoji: string;
  hint: string;
  category: string;
}

export default function ComingSoonAnimation({ title, emoji, hint, category }: ComingSoonAnimationProps) {
  const [dots, setDots] = useState('');
  const [sparkleVisible, setSparkleVisible] = useState(false);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    const sparkleInterval = setInterval(() => {
      setSparkleVisible(prev => !prev);
    }, 1500);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black/80">
            <Link href="/playground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Playground
            </Link>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Animated emoji */}
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl animate-bounce select-none">
              {emoji}
            </div>
            {sparkleVisible && (
              <div className="absolute -top-4 -right-4 text-2xl animate-ping">
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {title}
          </h1>

          {/* Category badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            {category}
          </div>

          {/* Coming soon card */}
          <Card className="max-w-2xl mx-auto mb-8 border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">
                  Coming Soon{dots}
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {hint}
              </p>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mb-8">
            <div className="h-full bg-gradient-to-r from-primary/50 to-primary animate-pulse rounded-full w-3/4"></div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" asChild>
              <Link href="/playground">
                Explore Other Projects
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-primary/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-primary/5 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}
