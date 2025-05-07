import { getGitHubRepos, type GitHubRepo } from '@/services/github';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Code2, Layers, PlayCircle } from 'lucide-react';

// Sample project data, assuming similar structure to ProjectsSection
const sampleProjects: GitHubRepo[] = [
  { name: 'Project Alpha', description: '', url: '', language: 'TypeScript', lastUpdated: '2024-01-01' },
  { name: 'Project Beta', description: '', url: '', language: 'Python', lastUpdated: '2024-01-01' },
  { name: 'Project Gamma', description: '', url: '', language: 'TypeScript', lastUpdated: '2024-01-01' },
  { name: 'Project Delta', description: '', url: '', language: 'Java', lastUpdated: '2024-01-01' },
  { name: 'Project Epsilon', description: '', url: '', language: 'JavaScript', lastUpdated: '2024-01-01' },
];


interface StatCardProps {
  icon: React.ElementType;
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

export default async function StatsSection() {
  // const projects = await getGitHubRepos('yourusername'); // Replace with actual username
  const projects = sampleProjects; // Using sample data

  const totalProjects = projects.length;
  const languages = new Set(projects.map(p => p.language).filter(Boolean));
  const totalLanguages = languages.size;
  
  // Placeholder values for frameworks and live projects
  const totalFrameworks = 4; // Manual or to be derived differently
  const liveProjects = 5; // Manual or to be derived differently

  return (
    <section id="stats" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
          My Impact in Numbers
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Briefcase} title="Projects Completed" value={totalProjects} />
          <StatCard icon={Code2} title="Languages Used" value={totalLanguages} />
          <StatCard icon={Layers} title="Frameworks Leveraged" value={totalFrameworks} />
          <StatCard icon={PlayCircle} title="Live Deployments" value={liveProjects} />
        </div>
      </div>
    </section>
  );
}
