import { notFound } from 'next/navigation';
import { getPlaygroundProject, getAllPlaygroundProjects } from '@/lib/playground';
import ComingSoonAnimation from '@/components/ui/ComingSoonAnimation';
import TipCalculator from '@/components/TipCalculator';
import type { Metadata } from 'next';

interface PlaygroundProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = getAllPlaygroundProjects();
  return projects.map((project) => ({
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

  // Render the actual tip calculator if the slug matches
  if (slug === 'tip-calculator') {
    return <TipCalculator />;
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
