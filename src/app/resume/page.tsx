import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Resume | AJ-Playground',
  description: "View and download AJ's professional resume.",
};

export default function ResumePage() {
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
          Professional Resume
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Download my latest resume or view it directly in your browser.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Button size="lg" asChild className="flex-1 sm:flex-none">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download>
              <Download className="mr-2 h-5 w-5" />
              Download PDF
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild className="flex-1 sm:flex-none">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-5 w-5" />
              View in Browser
            </a>
          </Button>
        </div>

        {/* Resume Preview Container */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Resume Preview
            </CardTitle>
            <CardDescription>
              Click the buttons above to download or view the full PDF resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[8.5/11] bg-muted/30 rounded-lg border border-border/50 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="bg-muted rounded-lg p-8 max-w-md">
                  <div className="w-16 h-20 bg-primary/20 rounded mx-auto mb-4 flex items-center justify-center">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">PDF Resume Available</h3>
                  <p className="text-sm mb-4">
                    My complete professional resume is available as a PDF document. 
                    Use the buttons above to view or download it.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Experience</h4>
                <p className="text-foreground">Full-Stack Developer</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Focus Areas</h4>
                <p className="text-foreground">Web Development, AI Integration, Modern Frameworks</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Technologies</h4>
                <p className="text-foreground">TypeScript, React, Next.js, Node.js, Python</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Portfolio</h4>
                <Link href="/" className="text-primary hover:underline">
                  aj-playground.org
                </Link>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">GitHub</h4>
                <a 
                  href="https://github.com/sudoaj" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/sudoaj
                </a>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">LinkedIn</h4>
                <a 
                  href="https://www.linkedin.com/in/abdulsalam-ajayi-a9722a33b/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Interested in working together? Feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/projects">
                View My Projects
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/blog">
                Read My Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
