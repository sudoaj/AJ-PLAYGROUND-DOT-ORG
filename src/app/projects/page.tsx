import type { Metadata } from 'next';
import type { GitHubRepo } from '@/services/github';
import ProjectCard from '@/components/ui/ProjectCard';
// import { getGitHubRepos } from '@/services/github'; // Would use in real app
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Re-using sample data from ProjectsSection for consistency
// In a real app, this would be fetched, possibly via getGitHubRepos
const sampleProjects: GitHubRepo[] = [
  {
    name: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform with Next.js, Stripe, and Firebase.',
    url: 'https://github.com/yourusername/ecommerce-platform',
    language: 'TypeScript',
    lastUpdated: '2024-07-15T10:30:00Z',
  },
  {
    name: 'AI Powered Chatbot',
    description: 'An intelligent chatbot using OpenAI API and LangChain for customer support.',
    url: 'https://github.com/yourusername/ai-chatbot',
    language: 'Python',
    lastUpdated: '2024-06-20T14:00:00Z',
  },
  {
    name: 'Data Visualization Dashboard',
    description: 'A React-based dashboard for visualizing complex datasets with D3.js.',
    url: 'https://github.com/yourusername/data-viz-dashboard',
    language: 'JavaScript',
    lastUpdated: '2024-05-01T09:15:00Z',
  },
   {
    name: 'Security Logger',
    description: 'A robust security logging system for enterprise applications.',
    url: 'https://github.com/yourusername/security-logger',
    language: 'Java',
    lastUpdated: '2023-11-10T18:45:00Z',
  },
  {
    name: 'Mobile Task Manager',
    description: 'A cross-platform mobile app for task management built with React Native.',
    url: 'https://github.com/yourusername/mobile-task-manager',
    language: 'TypeScript',
    lastUpdated: '2024-04-10T12:00:00Z',
  },
  {
    name: 'Cloud File Storage',
    description: 'A serverless cloud file storage solution using AWS S3 and Lambda.',
    url: 'https://github.com/yourusername/cloud-file-storage',
    language: 'Python',
    lastUpdated: '2024-03-05T16:30:00Z',
  },
];


export const metadata: Metadata = {
  title: 'All Projects | AJ-Playground',
  description: "Explore all of AJ's projects, showcasing work in web development, AI, and more.",
};

export default async function AllProjectsPage() {
  // const projects = await getGitHubRepos('yourusername'); // Replace 'yourusername' with actual username
  const projects = sampleProjects; // Using sample data for now

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
          AJ&apos;s Projects
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A collection of my work, experiments, and open-source contributions. Dive in and explore!
        </p>
      </header>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No projects to display at the moment.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back soon or visit my GitHub profile directly!</p>
        </div>
      )}
    </div>
  );
}
