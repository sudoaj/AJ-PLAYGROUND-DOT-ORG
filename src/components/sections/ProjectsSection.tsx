
import type { GitHubRepo } from '@/services/github';
import ProjectCard from '@/components/ui/ProjectCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Briefcase, Code2, Layers, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ElementType } from 'react';

// Sample project data for demonstration, matching GitHubRepo structure
const sampleProjects: GitHubRepo[] = [
  {
    name: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform with Next.js, Stripe, and Firebase.',
    url: 'https://github.com/yourusername/ecommerce-platform',
    language: 'TypeScript',
    lastUpdated: '2024-07-15T10:30:00Z',
  },
  {
    name: 'AI Powered Chatbot',
    description: 'An intelligent chatbot using OpenAI API and LangChain for customer support.',
    url: 'https://github.com/yourusername/ai-chatbot',
    language: 'Python',
    lastUpdated: '2024-06-20T14:00:00Z',
  },
  {
    name: 'Data Visualization Dashboard',
    description: 'A React-based dashboard for visualizing complex datasets with D3.js.',
    url: 'https://github.com/yourusername/data-viz-dashboard',
    language: 'JavaScript',
    lastUpdated: '2024-05-01T09:15:00Z',
  },
   {
    name: 'Security Logger',
    description: 'A robust security logging system for enterprise applications.',
    url: 'https://github.com/yourusername/security-logger',
    language: 'Java',
    lastUpdated: '2023-11-10T18:45:00Z',
  },
];

interface StatCardProps {
  icon: ElementType;
  title: string;
  value: string | number;
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
  // const projects = await getGitHubRepos('yourusername'); // Replace 'yourusername'
  const projects = sampleProjects; // Using sample data for now

  // Calculate stats based on the projects data
  const totalProjects = projects.length;
  const languages = new Set(projects.map(p => p.language).filter(Boolean));
  const totalLanguages = languages.size;
  
  // Placeholder values for frameworks and live projects (as they were in StatsSection)
  const totalFrameworks = 4; 
  const liveProjects = 5; 

  // Display a subset of projects for the homepage section
  const displayedProjects = projects.slice(0, 3);


  return (
    <section id="projects" className="py-16 md:py-24 bg-background/90 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Projects & Impact
        </h2>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          A showcase of my key projects and a glimpse into the technologies I&apos;ve worked with. Explore my GitHub for a full list of contributions.
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
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No projects to display at the moment.</p>
        )}

        {/* "View All Projects" Button */}
        {projects.length > 3 && (
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

