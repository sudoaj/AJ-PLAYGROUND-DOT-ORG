"use client";

import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CalendarDays, ExternalLink, Briefcase, Code, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import type { Project } from '@/types';
import { useState, useEffect } from 'react';
import { use } from 'react';

interface ProjectPageProps {
  params: Promise<{ projectName: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectName } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectName}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else if (response.status === 404) {
          setNotFoundError(true);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setNotFoundError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectName]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
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

  if (notFoundError || !project) {
    notFound();
  }

  const formattedDate = project.lastUpdated 
    ? format(parseISO(project.lastUpdated), 'MMM dd, yyyy')
    : null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Navigation */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
              {project.description}
            </p>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Last updated {formattedDate}
                </div>
              )}
              {project.language && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code className="h-4 w-4" />
                  {project.language}
                </div>
              )}
              {project.status && (
                <div className="flex items-center gap-2">
                  {project.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-sm capitalize text-muted-foreground">
                    {project.status}
                  </span>
                </div>
              )}
            </div>
            
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.url && project.url !== '#' && (
                <Button asChild>
                  <Link href={project.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Project
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <Separator className="mb-12" />

      {/* Project Content */}
      {project.content && (
        <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none 
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
            {project.content}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Projects
            </Link>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {project.author?.name && (
              <span>By {project.author.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}