import type { Project } from '@/lib/projects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CalendarDays, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

const slugify = (text: string) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const getProjectGradient = (slug: string) => {
  const gradients = [
    'bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 [--gradient-start:theme(colors.purple.600)] [--gradient-middle:theme(colors.pink.600)] [--gradient-end:theme(colors.red.500)]',
    'bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 [--gradient-start:theme(colors.blue.600)] [--gradient-middle:theme(colors.cyan.500)] [--gradient-end:theme(colors.teal.500)]',
    'bg-gradient-to-br from-emerald-600 via-green-500 to-lime-500 [--gradient-start:theme(colors.emerald.600)] [--gradient-middle:theme(colors.green.500)] [--gradient-end:theme(colors.lime.500)]',
    'bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-500 [--gradient-start:theme(colors.orange.600)] [--gradient-middle:theme(colors.amber.500)] [--gradient-end:theme(colors.yellow.500)]',
    'bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 [--gradient-start:theme(colors.indigo.600)] [--gradient-middle:theme(colors.purple.500)] [--gradient-end:theme(colors.pink.500)]',
    'bg-gradient-to-br from-rose-600 via-pink-500 to-purple-500 [--gradient-start:theme(colors.rose.600)] [--gradient-middle:theme(colors.pink.500)] [--gradient-end:theme(colors.purple.500)]',
    'bg-gradient-to-br from-slate-600 via-gray-500 to-zinc-500 [--gradient-start:theme(colors.slate.600)] [--gradient-middle:theme(colors.gray.500)] [--gradient-end:theme(colors.zinc.500)]',
    'bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-500 [--gradient-start:theme(colors.violet.600)] [--gradient-middle:theme(colors.indigo.500)] [--gradient-end:theme(colors.blue.500)]'
  ];
  
  // Generate a consistent index based on the slug
  const hash = slug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return gradients[Math.abs(hash) % gradients.length];
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = project.lastUpdated ? format(parseISO(project.lastUpdated), 'MMM dd, yyyy') : 'N/A';

  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        <div 
          className={`w-full h-full transition-transform duration-300 hover:scale-105 ${getProjectGradient(project.slug)}`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-middle) 50%, var(--gradient-end) 100%)
            `,
            backgroundSize: '50px 50px, 30px 30px, 70px 70px, 100% 100%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl text-primary hover:text-primary/80 transition-colors">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground min-h-[3em] line-clamp-2">
          {project.description || 'No description available.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Last Updated: {formattedDate}</span>
        </div>
        {project.language && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Tag className="mr-2 h-4 w-4" />
            <Badge variant="secondary">{project.language}</Badge>
          </div>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full">
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            View on GitHub
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}