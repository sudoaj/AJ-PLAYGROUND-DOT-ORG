"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PlaygroundCard from '@/components/ui/PlaygroundCard';
import type { PlaygroundProject } from '@/types';
import { useState, useEffect } from 'react';

export default function PlaygroundSection() {
  const [allProjects, setAllProjects] = useState<PlaygroundProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/playground');
        if (response.ok) {
          const data = await response.json();
          setAllProjects(data);
        }
      } catch (error) {
        console.error('Error fetching playground projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <section id="playground" className="py-16 md:py-24 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Playground
          </h2>
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            Interactive experiments and mini-projects. Click "Interact Now" to explore each project!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Get only live projects for the homepage (no coming soon or abandoned)
  const liveProjects = allProjects.filter(project => 
    project.isLive && !project.isAbandoned
  );
  
  // Show up to 4 live projects
  const displayProjects = liveProjects.slice(0, 4);

  return (
    <section id="playground" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Playground
        </h2>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Interactive experiments and mini-projects. Click "Interact Now" to explore each project!
        </p>
        
        {displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProjects.map((project) => (
              <PlaygroundCard 
                key={project.id} 
                project={project} 
                showInteractButton={true} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No playground projects available yet.</p>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/playground">
              View All Playground Projects
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
