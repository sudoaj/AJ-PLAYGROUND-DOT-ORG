import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Code } from 'lucide-react';
import { getAllPlaygroundProjects } from '@/lib/playground';
import PlaygroundCard from '@/components/ui/PlaygroundCard';

export const metadata: Metadata = {
  title: 'Playground | AJ-Playground',
  description: "Explore AJ's interactive experiments, code snippets, and mini-projects.",
};

export default function PlaygroundPage() {
  const playgroundProjects = getAllPlaygroundProjects();
  
  // Separate projects by status
  const liveProjects = playgroundProjects.filter(project => project.isLive && !project.isAbandoned);
  const comingSoonProjects = playgroundProjects.filter(project => !project.isLive && !project.isAbandoned);
  const abandonedProjects = playgroundProjects.filter(project => project.isAbandoned);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black/80">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <header className="text-center mb-10 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
          AJ&apos;s Playground
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive experiments and mini-projects. Click on any project to explore!
        </p>
      </header>

      {/* Live Projects */}
      {liveProjects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            Live Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveProjects.map((project) => (
              <PlaygroundCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon Projects */}
      {comingSoonProjects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonProjects.map((project) => (
              <PlaygroundCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Abandoned Projects */}
      {abandonedProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            Abandoned Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {abandonedProjects.map((project) => (
              <PlaygroundCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
