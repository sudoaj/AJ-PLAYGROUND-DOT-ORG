import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAllPlaygroundProjects } from '@/lib/playground';
import PlaygroundCard from '@/components/ui/PlaygroundCard';

export default function PlaygroundSection() {
  // Get all playground projects
  const allProjects = getAllPlaygroundProjects();
  
  // Show up to 4 projects for homepage preview
  const displayProjects = allProjects.slice(0, 4);

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
          {displayProjects.map((project) => (
            <PlaygroundCard 
              key={project.id} 
              project={project} 
              showInteractButton={true} 
            />
          ))}
        </div>

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
