import { getGitHubRepos, type GitHubRepo } from '@/services/github';
import ProjectCard from '@/components/ui/ProjectCard';
import { Separator } from '@/components/ui/separator';

// Sample project data for demonstration, matching GitHubRepo structure
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
];


export default async function ProjectsSection() {
  // In a real app, you might want to fetch this data on the client-side 
  // if it needs to be very dynamic or if API rate limits are a concern.
  // For this example, we'll use the server-side fetched (mocked) data.
  // const projects = await getGitHubRepos('yourusername'); // Replace 'yourusername'
  const projects = sampleProjects; // Using sample data for now

  return (
    <section id="projects" className="py-16 md:py-24 bg-background/90 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Projects
        </h2>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Here are some of the projects I&apos;ve been working on. Explore my GitHub for more.
        </p>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No projects to display at the moment.</p>
        )}
      </div>
    </section>
  );
}
