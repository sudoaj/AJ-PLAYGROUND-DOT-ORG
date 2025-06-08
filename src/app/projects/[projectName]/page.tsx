import type { GitHubRepo } from '@/services/github';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CalendarDays, ExternalLink, Briefcase, Code, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

// Sample project data, should be consistent with /projects/page.tsx and other sources
const sampleProjects: GitHubRepo[] = [
  {
    name: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform with Next.js, Stripe, and Firebase. This project aims to provide a seamless shopping experience for users and a robust management system for administrators.',
    url: 'https://github.com/yourusername/ecommerce-platform',
    language: 'TypeScript',
    lastUpdated: '2024-07-15T10:30:00Z',
  },
  {
    name: 'AI Powered Chatbot',
    description: 'An intelligent chatbot using OpenAI API and LangChain for customer support. It can understand natural language queries and provide relevant assistance or escalate issues to human agents.',
    url: 'https://github.com/yourusername/ai-chatbot',
    language: 'Python',
    lastUpdated: '2024-06-20T14:00:00Z',
  },
  {
    name: 'Data Visualization Dashboard',
    description: 'A React-based dashboard for visualizing complex datasets with D3.js. It offers interactive charts and graphs to help users gain insights from their data effectively.',
    url: 'https://github.com/yourusername/data-viz-dashboard',
    language: 'JavaScript',
    lastUpdated: '2024-05-01T09:15:00Z',
  },
   {
    name: 'Security Logger',
    description: 'A robust security logging system for enterprise applications. It provides comprehensive audit trails and real-time alerts for potential security breaches.',
    url: 'https://github.com/yourusername/security-logger',
    language: 'Java',
    lastUpdated: '2023-11-10T18:45:00Z',
  },
  {
    name: 'Mobile Task Manager',
    description: 'A cross-platform mobile app for task management built with React Native. It helps users organize their tasks, set reminders, and collaborate with team members.',
    url: 'https://github.com/yourusername/mobile-task-manager',
    language: 'TypeScript',
    lastUpdated: '2024-04-10T12:00:00Z',
  },
  {
    name: 'Cloud File Storage',
    description: 'A serverless cloud file storage solution using AWS S3 and Lambda. It offers scalable, secure, and cost-effective file storage with easy access and management capabilities.',
    url: 'https://github.com/yourusername/cloud-file-storage',
    language: 'Python',
    lastUpdated: '2024-03-05T16:30:00Z',
  },
];

// Utility function to slugify project names
const slugify = (text: string): string => {
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

// Function to generate static paths
export async function generateStaticParams() {
  return sampleProjects.map((project) => ({
    projectName: slugify(project.name),
  }));
}

// Function to get project data
async function getProjectData(slug: string): Promise<GitHubRepo | undefined> {
  return sampleProjects.find((project) => slugify(project.name) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ projectName: string }> }) {
  const { projectName } = await params;
  const project = await getProjectData(projectName);
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  return {
    title: `${project.name} | AJ-Playground Projects`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectName: string }> }) {
  const { projectName } = await params;
  const project = await getProjectData(projectName);

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">Sorry, we couldn't find the project you're looking for.</p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Projects
          </Link>
        </Button>
      </div>
    );
  }

  const formattedDate = project.lastUpdated ? format(parseISO(project.lastUpdated), 'MMMM dd, yyyy') : 'N/A';
  const imageUrl = `https://picsum.photos/seed/${slugify(project.name)}/800/450`;
  const imageHint = `project ${project.language ? project.language.toLowerCase() : 'tech'}`;

  return (
    <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-8 text-primary hover:text-primary/80">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Projects
        </Link>
      </Button>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 text-foreground leading-tight">
        {project.name}
      </h1>
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <CalendarDays className="mr-2 h-4 w-4" />
        <span>Last Updated: {formattedDate}</span>
      </div>
      {project.language && (
        <div className="mb-6">
          <Badge variant="secondary" className="text-sm py-1 px-3">
            <Code className="mr-2 h-4 w-4" /> {project.language}
          </Badge>
        </div>
      )}
      
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={imageUrl}
          alt={project.name}
          fill
          className="object-cover"
          data-ai-hint={imageHint}
          priority
        />
      </div>
      
      <Separator className="my-8" />

      <div className="prose prose-invert prose-lg max-w-none dark:prose-invert 
                      prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary hover:prose-a:text-primary/80
                      prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-foreground/70
                      prose-ul:text-foreground/80 prose-li:marker:text-primary
                      prose-code:text-sm prose-code:bg-muted prose-code:p-1 prose-code:rounded-sm">
        
        <h2><Briefcase className="inline-block mr-2 h-6 w-6 text-primary" />Project Overview</h2>
        <p>{project.description}</p>
        <p>
          This project showcases practical application of modern development techniques to solve real-world problems. 
          It was developed with a focus on scalability, maintainability, and user experience.
        </p>

        <h2><CheckCircle className="inline-block mr-2 h-6 w-6 text-primary" />Key Features</h2>
        <ul>
          <li>Responsive and accessible user interface design.</li>
          <li>Efficient data handling and state management.</li>
          <li>{`Integration with third-party services (e.g., ${project.language === 'TypeScript' || project.language === 'JavaScript' ? 'Stripe, Firebase' : project.language === 'Python' ? 'OpenAI API, AWS S3' : 'Relevant APIs'}).`}</li>
          <li>Secure authentication and authorization mechanisms.</li>
          <li>Comprehensive test coverage ensuring reliability.</li>
        </ul>

        <h2><Code className="inline-block mr-2 h-6 w-6 text-primary" />Technology Stack</h2>
        <p>
          The primary technology used in this project is <strong>{project.language}</strong>. 
          Alongside this, other significant technologies and frameworks employed include:
        </p>
        <ul>
          <li>{project.language === 'TypeScript' || project.language === 'JavaScript' ? 'Next.js, React, Node.js' : project.language === 'Python' ? 'Django/Flask, Pandas, NumPy' : 'Spring Boot, Maven (for Java)'}.</li>
          <li>Tailwind CSS for styling.</li>
          <li>{project.language === 'TypeScript' ? 'Firebase/Supabase' : project.language === 'Python' ? 'PostgreSQL/MongoDB' : 'MySQL/Oracle (for Java)'} for database management.</li>
          <li>Version control with Git and GitHub.</li>
          <li>Deployed using Vercel / AWS / Docker (as appropriate).</li>
        </ul>

        <h2><AlertTriangle className="inline-block mr-2 h-6 w-6 text-primary" />Challenges & Learnings</h2>
        <p>
          One of the main challenges during the development of &quot;{project.name}&quot; was 
          {project.name.toLowerCase().includes('ai') ? 'optimizing the performance of AI model interactions and ensuring real-time responses.' : 
           project.name.toLowerCase().includes('e-commerce') ? 'handling complex state logic for cart and checkout processes while ensuring data integrity.' :
           project.name.toLowerCase().includes('dashboard') ? 'efficiently rendering large datasets and maintaining interactivity.' :
           'ensuring cross-browser compatibility and optimizing for mobile devices.'}
          Overcoming this involved extensive research, refactoring, and implementing advanced caching strategies. This project was a great learning experience in terms of 
          {project.language === 'Python' ? 'working with large language models and asynchronous programming.' : 
           project.language === 'Java' ? 'enterprise design patterns and microservices architecture.' :
           'modern full-stack development practices and CI/CD pipelines.'}
        </p>
        
        <div className="mt-10">
          <Button asChild size="lg">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              View Project on GitHub
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}