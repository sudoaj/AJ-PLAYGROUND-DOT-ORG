import { notFound } from 'next/navigation';
import { getPlaygroundProject, getAllPlaygroundProjects } from '@/lib/playground';
import ComingSoonAnimation from '@/components/ui/ComingSoonAnimation';
import type { Metadata } from 'next';

interface PlaygroundProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = getAllPlaygroundProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PlaygroundProjectPageProps): Promise<Metadata> {
  const project = getPlaygroundProject(params.slug);
  
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

export default function PlaygroundProjectPage({ params }: PlaygroundProjectPageProps) {
  const project = getPlaygroundProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <ComingSoonAnimation
      title={project.title}
      emoji={project.emoji}
      hint={project.comingSoonHint}
      category={project.category}
    />
  );
}
