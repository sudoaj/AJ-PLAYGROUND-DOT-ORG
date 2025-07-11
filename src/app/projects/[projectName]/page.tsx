import { getProjectBySlug, getAllProjects } from '@/lib/projects';
import { notFound } from 'next/navigation';

import ReactMarkdown from 'react-markdown';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CalendarDays, ExternalLink, Briefcase, Code, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

interface ProjectPageProps {
  params: Promise<{ projectName: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    projectName: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { projectName } = await params;
  const project = await getProjectBySlug(projectName);
  
  if (!project) {
    return {
      title: 'Project Not Found | AJ-Playground',
    };
  }

  return {
    title: `${project.title} | AJ-Playground`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectName } = await params;
  const projectData = await getProjectBySlug(projectName);

  if (!projectData) {
    notFound();
  }

  const formattedDate = projectData.lastUpdated 
    ? format(parseISO(projectData.lastUpdated), 'MMMM dd, yyyy') 
    : 'N/A';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-full md:w-80 h-48 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] opacity-50"></div>
            <div className="relative z-10 text-white text-center">
              <div className="text-3xl font-bold mb-2">{projectData.title.split(' ').map(word => word[0]).join('')}</div>
              <div className="text-sm opacity-80">{projectData.language}</div>
            </div>
          </div>
          <div className="flex-1"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {projectData.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {projectData.description}
            </p>
            
            {/* Project Metadata */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Last Updated: {formattedDate}</span>
              </div>
              
              {projectData.language && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Code className="mr-2 h-4 w-4" />
                  <Badge variant="secondary">{projectData.language}</Badge>
                </div>
              )}

              {projectData.status && (
                <div className="flex items-center text-sm text-muted-foreground">
                  {projectData.status === 'completed' ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                  )}
                  <Badge variant={projectData.status === 'completed' ? 'default' : 'secondary'}>
                    {projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1)}
                  </Badge>
                </div>
              )}
            </div>

            {/* Technologies */}
            {projectData.technologies && projectData.technologies.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Technologies Used:</h3>
                <div className="flex flex-wrap gap-2">
                  {projectData.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* GitHub Link */}
            <div className="mt-6">
              <Button asChild>
                <a href={projectData.url} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Separator className="my-8" />

      {/* Project Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            // Custom link handling
            a: ({ href, children, ...props }) => {
              const isExternal = href?.startsWith('http');
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
                  {...props}
                >
                  {children}
                  {isExternal && <ExternalLink className="inline ml-1 h-3 w-3" />}
                </a>
              );
            },
            // Enhanced code blocks
            pre: ({ children, ...props }) => (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto border" {...props}>
                {children}
              </pre>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            // Enhanced headings
            h1: ({ children, ...props }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="text-xl font-medium mt-4 mb-2 text-foreground" {...props}>
                {children}
              </h3>
            ),
            // Enhanced tables
            table: ({ children, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border border-border" {...props}>
                  {children}
                </table>
              </div>
            ),
            th: ({ children, ...props }) => (
              <th className="border border-border bg-muted p-2 text-left font-medium" {...props}>
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="border border-border p-2" {...props}>
                {children}
              </td>
            ),
            // Enhanced blockquotes
            blockquote: ({ children, ...props }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props}>
                {children}
              </blockquote>
            ),
            // Enhanced lists
            ul: ({ children, ...props }) => (
              <ul className="list-disc pl-6 my-4 space-y-1" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="list-decimal pl-6 my-4 space-y-1" {...props}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li className="text-foreground" {...props}>
                {children}
              </li>
            ),
            // Enhanced paragraphs
            p: ({ children, ...props }) => (
              <p className="my-4 text-foreground leading-relaxed" {...props}>
                {children}
              </p>
            ),
            // Enhanced images
            img: ({ src, alt, ...props }) => (
              <div className="my-6">
                <img
                  src={src || ''}
                  alt={alt || ''}
                  className="w-full rounded-lg border border-border"
                  {...props}
                />
              </div>
            ),
          }}
        >
          {projectData.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
