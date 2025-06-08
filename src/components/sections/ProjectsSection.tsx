import ProjectCard from '@/components/ui/ProjectCard';
import { getFeaturedProjects, getAllProjects } from '@/lib/projects';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Briefcase, Code2, Layers, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ElementType } from 'react';

interface StatCardProps {
  icon: ElementType;
  title: string;
  value: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, className }) => (
  <Card className={`shadow-lg hover:shadow-primary/30 transition-shadow ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground">{value}</div>
    </CardContent>
  </Card>
);

export default async function ProjectsSection() {
  const featuredProjects = await getFeaturedProjects();
  const allProjects = await getAllProjects();
  
  // If we have fewer than 3 featured projects, supplement with regular projects
  let displayProjects = [...featuredProjects];
  if (displayProjects.length < 3) {
    const additionalProjects = allProjects
      .filter(p => !p.featured) // Only non-featured projects
      .slice(0, 3 - displayProjects.length); // Fill up to 3 total
    displayProjects = [...displayProjects, ...additionalProjects];
  }
  
  // Calculate stats based on all projects
  const totalProjects = allProjects.length;
  const languages = new Set(allProjects.map((p) => p.language).filter(Boolean));
  const totalLanguages = languages.size;
  
  // Calculate frameworks from technologies array
  const allTechnologies = allProjects.flatMap(p => p.technologies || []);
  const frameworks = new Set(allTechnologies.filter(tech => 
    ['React', 'Next.js', 'Vue', 'Angular', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring'].includes(tech)
  ));
  const totalFrameworks = frameworks.size;
  
  // Count projects with actual URLs (not just "#")
  const liveProjects = allProjects.filter(p => p.url && p.url !== '#').length; 

  // Display a subset of projects for the homepage section
  const displayedProjects = displayProjects.slice(0, 3);

  return (
    <section id="projects" className="py-16 md:py-24 bg-background/90 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Projects & Impact
        </h2>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          A showcase of my key projects and a glimpse into the technologies I&apos;ve worked with.
        </p>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12 md:mb-16">
          <StatCard icon={Briefcase} title="Projects Completed" value={totalProjects} />
          <StatCard icon={Code2} title="Languages Used" value={totalLanguages} />
          <StatCard icon={Layers} title="Frameworks Leveraged" value={totalFrameworks} />
          <StatCard icon={PlayCircle} title="Live Deployments" value={liveProjects} />
        </div>

        
        
        {/* Projects Grid */}
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No projects to display at the moment.</p>
        )}

        {/* "View All Projects" Button */}
        {allProjects.length > 3 && (
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
