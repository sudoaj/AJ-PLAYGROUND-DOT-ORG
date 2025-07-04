import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaygroundProject } from '@/types';
import { ArrowRight } from 'lucide-react';

interface PlaygroundCardProps {
  project: PlaygroundProject;
  showInteractButton?: boolean;
}

export default function PlaygroundCard({ project, showInteractButton = false }: PlaygroundCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
            {project.emoji}
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {project.category}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground overflow-hidden">
          {project.shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${
              project.isLive ? 'bg-green-500' : 
              project.isAbandoned ? 'bg-red-500' : 
              'bg-yellow-500'
            } ${project.isAbandoned ? '' : 'animate-pulse'}`}></div>
            {project.isLive ? 'Live Now' : project.isAbandoned ? 'Abandoned' : 'Coming Soon'}
          </div>
          {showInteractButton && (
            <Button size="sm" variant="outline" asChild className="group/btn">
              <Link href={`/playground/${project.slug}`}>
                {project.isLive ? 'Try It Now' : project.isAbandoned ? 'View Anyway' : 'Interact Now'}
                <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </div>
        {!showInteractButton && (
          <div className="mt-4">
            <Button size="sm" variant="outline" asChild className="w-full">
              <Link href={`/playground/${project.slug}`}>
                {project.isLive ? 'Try It Now' : project.isAbandoned ? 'View Anyway' : 'View Project'}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
