import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaygroundProject } from '@/types';
import { Clock, ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';
import ComingSoonAnimation from './ComingSoonAnimation';

interface PlaygroundCardProps {
  project: PlaygroundProject;
  showInteractButton?: boolean;
  viewMode?: 'grid' | 'list';
}

export default function PlaygroundCard({ project, showInteractButton = false, viewMode = 'grid' }: PlaygroundCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <span className="text-3xl">{project.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <Badge variant={project.isLive ? "default" : project.isAbandoned ? "destructive" : "secondary"}>
                    {project.isLive ? "Live" : project.isAbandoned ? "Abandoned" : "Coming Soon"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {project.shortDescription}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              {project.isLive && !project.isAbandoned ? (
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/playground/${project.slug}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Project
                    </Link>
                  </Button>
                  {showInteractButton && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/playground/${project.slug}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Interact Now
                      </Link>
                    </Button>
                  )}
                </div>
              ) : project.isAbandoned ? (
                <Button disabled size="sm" variant="outline" className="cursor-not-allowed">
                  No longer available
                </Button>
              ) : (
                <Button disabled size="sm" variant="outline" className="cursor-not-allowed">
                  <Clock className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{project.emoji}</span>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <Badge variant={project.isLive ? "default" : project.isAbandoned ? "destructive" : "secondary"}>
                {project.isLive ? "Live" : project.isAbandoned ? "Abandoned" : "Coming Soon"}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          {project.shortDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {project.description}
          </p>
          <Badge variant="outline" className="text-xs">
            {project.category}
          </Badge>
        </div>

        <div className="pt-4 border-t">
          {project.isLive && !project.isAbandoned ? (
            <div className="flex gap-2">
              <Button asChild className="flex-1" size="sm">
                <Link href={`/playground/${project.slug}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Project
                </Link>
              </Button>
              {showInteractButton && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/playground/${project.slug}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Interact Now
                  </Link>
                </Button>
              )}
            </div>
          ) : project.isAbandoned ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">This project has been abandoned</p>
              <Button disabled size="sm" variant="outline" className="cursor-not-allowed">
                No longer available
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <ComingSoonAnimation />
              <p className="text-sm text-muted-foreground mt-2 italic">
                {project.comingSoonHint}
              </p>
              <Button disabled size="sm" variant="outline" className="mt-2 cursor-not-allowed">
                <Clock className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}