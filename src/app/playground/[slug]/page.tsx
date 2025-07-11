import { notFound, redirect } from 'next/navigation';
import { getPlaygroundProject, getAllPlaygroundProjects } from '@/lib/playground';
import ComingSoonAnimation from '@/components/ui/ComingSoonAnimation';
import TipCalculator from '@/components/TipCalculator';
import BasicCalculator from '@/components/BasicCalculator';
import ResumeBuilder from '@/components/ResumeBuilder';
import type { Metadata } from 'next';

interface PlaygroundProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = getAllPlaygroundProjects();
  return projects
    .filter(project => project.slug !== 'position-fit') // Exclude position-fit as it has its own dedicated route
    .map((project) => ({
      slug: project.slug,
    }));
}

export async function generateMetadata({ params }: PlaygroundProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPlaygroundProject(slug);
  
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

export default async function PlaygroundProjectPage({ params }: PlaygroundProjectPageProps) {
  const { slug } = await params;
  const project = getPlaygroundProject(slug);

  if (!project) {
    notFound();
  }

  switch (slug) {
    case 'tip-calculator':
      return <TipCalculator />;
    case 'basic-calculator':
      return <BasicCalculator />;
    case 'resume-builder':
      return <ResumeBuilder />;
    default:
      break;
  }

  // For all other projects, show coming soon animation
  return (
    <ComingSoonAnimation
      title={project.title}
      emoji={project.emoji}
      hint={project.comingSoonHint}
      category={project.category}
    />
  );
}
