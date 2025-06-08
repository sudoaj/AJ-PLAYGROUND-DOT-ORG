import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction, Code, Gamepad2, Zap, Coffee, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Playground | AJ-Playground',
  description: "Explore AJ's interactive experiments, code snippets, and mini-projects.",
};

const playgroundItems = [
  {
    title: 'Interactive Canvas Animation',
    description: 'A dynamic particle system with responsive animations.',
    icon: Palette,
    status: 'Coming Soon',
    type: 'Animation'
  },
  {
    title: 'Code Snippet Generator',
    description: 'Generate beautiful code snippets with syntax highlighting.',
    icon: Code,
    status: 'Coming Soon',
    type: 'Utility'
  },
  {
    title: 'Mini Game Collection',
    description: 'Simple browser games built with HTML5 Canvas.',
    icon: Gamepad2,
    status: 'Coming Soon',
    type: 'Game'
  },
  {
    title: 'API Response Visualizer',
    description: 'Visualize JSON API responses in a tree structure.',
    icon: Zap,
    status: 'Coming Soon',
    type: 'Tool'
  },
  {
    title: 'CSS Animation Playground',
    description: 'Experiment with CSS animations and transitions.',
    icon: Coffee,
    status: 'Coming Soon',
    type: 'CSS'
  },
  {
    title: 'Data Structure Visualizer',
    description: 'Interactive visualizations of common data structures.',
    icon: Construction,
    status: 'Coming Soon',
    type: 'Educational'
  }
];

export default function PlaygroundPage() {
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
          AJ&apos;s Playground
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A space for interactive experiments, code snippets, and mini-projects. Dive in and explore!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {playgroundItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {item.type}
                  </div>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="aspect-video bg-muted/50 rounded-b-md flex items-center justify-center border-t">
                <div className="text-center text-muted-foreground">
                  <Construction className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">{item.status}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-muted/30 rounded-lg p-8 border border-border/50">
          <h2 className="text-2xl font-bold mb-4">More Experiments Coming Soon!</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            This playground is actively being developed. Check back soon for interactive demos, 
            code experiments, and educational tools.
          </p>
          <Button variant="outline" asChild>
            <Link href="/projects">
              <Code className="mr-2 h-4 w-4" />
              View My Projects Instead
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
