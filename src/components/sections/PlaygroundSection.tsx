import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function PlaygroundSection() {
  return (
    <section id="playground" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Playground
        </h2>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          A space for interactive experiments, code snippets, and mini-projects. Dive in and explore!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Interactive Experiment 1</CardTitle>
              <CardDescription>A cool canvas animation or a small utility app.</CardDescription>
            </CardHeader>
            <CardContent className="aspect-video bg-muted rounded-b-md flex items-center justify-center">
              {/* Placeholder for an embedded iframe or custom component */}
              <div className="text-center text-muted-foreground">
                <Construction className="h-12 w-12 mx-auto mb-2" />
                <p>Live Demo Coming Soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Code Snippet Showcase</CardTitle>
              <CardDescription>Embedding a JSFiddle or CodePen example.</CardDescription>
            </CardHeader>
            <CardContent className="aspect-video bg-muted rounded-b-md flex items-center justify-center">
              {/* Placeholder for an embedded code editor */}
               <div className="text-center text-muted-foreground">
                <Construction className="h-12 w-12 mx-auto mb-2" />
                <p>Embedded Code Editor Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
            <p className="text-muted-foreground">SORRY: This section is actively being developed. Check back for more interactive fun!</p>
        </div>
      </div>
    </section>
  );
}
