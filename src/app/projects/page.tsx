import type { Metadata } from 'next';
import ProjectCard from '@/components/ui/ProjectCard';
import { getAllProjects } from '@/lib/projects';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Projects | AJ-Playground',
  description: "Explore all of AJ's projects, showcasing work in web development, AI, and more.",
};

export default async function AllProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <header className="text-center mb-10 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
          AJ&apos;s Projects
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A collection of my work, experiments, and open-source contributions. Dive in and explore!
        </p>
      </header>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No projects to display at the moment.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back soon for new projects!</p>
        </div>
      )}
    </div>
  );
}
