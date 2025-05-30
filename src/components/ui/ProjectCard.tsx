import type { GitHubRepo } from '@/services/github';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CalendarDays, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

interface ProjectCardProps {
  project: GitHubRepo;
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

export default function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = project.lastUpdated ? format(parseISO(project.lastUpdated), 'MMM dd, yyyy') : 'N/A';
  const projectSlug = slugify(project.name);

  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl text-primary hover:text-primary/80 transition-colors">
          <Link href={`/projects/${projectSlug}`}>{project.name}</Link>
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