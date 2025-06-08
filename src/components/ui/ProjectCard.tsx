import type { Project } from '@/lib/projects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CalendarDays, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

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

export default function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = project.lastUpdated ? format(parseISO(project.lastUpdated), 'MMM dd, yyyy') : 'N/A';

  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        <Image
          src={project.imageUrl}
          alt={project.imageHint}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
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