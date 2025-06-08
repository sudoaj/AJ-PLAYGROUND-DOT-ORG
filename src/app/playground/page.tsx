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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {playgroundProjects.map((project) => (
          <PlaygroundCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
