"use client";

import { notFound, redirect } from 'next/navigation';
import ComingSoonAnimation from '@/components/ui/ComingSoonAnimation';
import TipCalculator from '@/components/TipCalculator';
import BasicCalculator from '@/components/BasicCalculator';
import ResumeBuilder from '@/components/ResumeBuilder';
import type { PlaygroundProject } from '@/types';
import { useState, useEffect } from 'react';
import { use } from 'react';

interface PlaygroundProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PlaygroundProjectPage({ params }: PlaygroundProjectPageProps) {
  const { slug } = use(params);
  const [project, setProject] = useState<PlaygroundProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/playground/${slug}`);
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
  }, [slug]);

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
