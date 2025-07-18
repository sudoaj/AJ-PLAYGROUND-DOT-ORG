"use client";

import { notFound, redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ComingSoonAnimation from '@/components/ui/ComingSoonAnimation';
import TipCalculator from '@/components/TipCalculator';
import BasicCalculator from '@/components/BasicCalculator';
import ResumeBuilder from '@/components/ResumeBuilder';
import { Button } from '@/components/ui/button';
import type { PlaygroundProject } from '@/types';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { Lock, User, ArrowLeft, Clock } from 'lucide-react';

interface PlaygroundProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PlaygroundProjectPage({ params }: PlaygroundProjectPageProps) {
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const [project, setProject] = useState<PlaygroundProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  // Handle authentication loading
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex items-center gap-2">
            <Clock className="w-6 h-6 animate-spin" />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="text-center space-y-4">
            <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Authentication Required</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Please sign in to access this playground project!
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/auth/signin">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/playground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Playground
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchProject = async () => {
      if (!session) return;
      
      try {
        const response = await fetch(`/api/playground/${slug}`, {
          headers: {
            'Authorization': `Bearer ${session.user?.email}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else if (response.status === 404) {
          setNotFoundError(true);
        }
      } catch (error) {
        console.error('Error fetching playground project:', error);
        setNotFoundError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [slug, session]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
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

  if (notFoundError || !project) {
    notFound();
  }

  switch (slug) {
    case 'tip-calculator':
      return <TipCalculator />;
    case 'basic-calculator':
      return <BasicCalculator />;
    case 'resume-builder':
      return <ResumeBuilder />;
    case 'position-fit':
      // Redirect to the dedicated position-fit route
      redirect('/playground/position-fit');
      return null;
    default:
      // Show coming soon for projects that aren't implemented yet
      return (
        <ComingSoonAnimation 
          title={project.title}
          emoji={project.emoji}
          hint={project.comingSoonHint || "We're working hard to bring this to you!"}
          category={project.category}
        />
      );
  }
}
