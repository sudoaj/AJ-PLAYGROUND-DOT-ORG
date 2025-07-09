import { PlaygroundProject } from '@/types';

export const playgroundProjects: PlaygroundProject[] = [
  {
    id: '1',
    title: 'Future OS Concept Visualizer',
    emoji: '🚀',
    description: 'An interactive visualization of what operating systems might look like in the future, featuring dynamic interfaces, AI-powered assistants, and immersive experiences.',
    shortDescription: 'Explore futuristic OS concepts with interactive animations',
    slug: 'future-os-visualizer',
    category: 'Visualization',
    comingSoonHint: 'Expect stunning animations, gesture controls, and a peek into tomorrow\'s computing experience.',
    isLive: false,
    isAbandoned: false

  },
  {
    id: '2',
    title: 'Retro Games',
    emoji: '🎮',
    description: 'A collection of classic retro games recreated with modern web technologies, bringing back the nostalgia of arcade gaming.',
    shortDescription: 'Classic arcade games reimagined for the web',
    slug: 'retro-games',
    category: 'Gaming',
    comingSoonHint: 'Get ready for Pong, Snake, Tetris, and more classics with pixel-perfect graphics and chiptune sounds.',
    isLive: true,
    isAbandoned: false
  },
  {
    id: '3',
    title: 'Tip Calculator',
    emoji: '💰',
    description: 'A smart tip calculator that helps you calculate tips, split bills, and even suggests appropriate tip amounts based on service quality.',
    shortDescription: 'Smart bill splitting and tip calculation',
    slug: 'tip-calculator',
    category: 'Utility',
    comingSoonHint: 'Features will include bill splitting, service rating integration, and currency conversion.',
    isLive: true,
    isAbandoned: false
  },
  {
    id: '4',
    title: 'Developer Cheatsheet',
    emoji: '📝',
    description: 'An interactive cheatsheet for developers with searchable syntax references, code snippets, and quick lookup tools for multiple programming languages.',
    shortDescription: 'Interactive reference guide for developers',
    slug: 'developer-cheatsheet',
    category: 'Tool',
    comingSoonHint: 'Will include syntax highlighting, interactive examples, and offline access to your favorite programming languages.',
    isLive: false,
    isAbandoned: false
  },
  {
    id: '5',
    title: 'Basic Calculator',
    emoji: '🧮',
    description: 'A simple calculator that was built as an early experiment. Basic arithmetic operations with a retro design.',
    shortDescription: 'Simple arithmetic calculator (abandoned)',
    slug: 'basic-calculator',
    category: 'Tool',
    comingSoonHint: 'This project has been abandoned in favor of more advanced tools.',
    isLive: false,
    isAbandoned: true,
  },
  {
    id: '6',
    title: 'Resume Builder',
    emoji: '📝',
    description: 'An AI-powered resume builder that helps you create professional resumes with intelligent text rewriting, bullet point generation, and export to multiple formats.',
    shortDescription: 'AI-powered resume creation and editing tool',
    slug: 'resume-builder',
    category: 'Tool',
    comingSoonHint: 'Features intelligent text rewriting, AI bullet point generation, and export to JSON/LaTeX formats.',
    isLive: true,
    isAbandoned: false,
  },
  {
    id: '7',
    title: 'Position Fit AI',
    emoji: '🎯',
    description: 'An AI-powered tool that analyzes job postings and intelligently tailors your resume to maximize your chances of landing interviews. Upload a job description and your resume to get detailed compatibility analysis and optimization suggestions.',
    shortDescription: 'AI-powered job-resume compatibility analyzer',
    slug: 'position-fit',
    category: 'AI Tool',
    comingSoonHint: 'Features job posting analysis, resume parsing, AI-powered matching, and intelligent resume optimization.',
    isLive: true,
    isAbandoned: false,
  }
];

export function getPlaygroundProject(slug: string): PlaygroundProject | undefined {
  return playgroundProjects.find(project => project.slug === slug);
}

export function getAllPlaygroundProjects(): PlaygroundProject[] {
  return playgroundProjects;
}

export function getActivePlaygroundProjects(): PlaygroundProject[] {
  return playgroundProjects.filter(project => !project.isAbandoned);
}

export function getLivePlaygroundProjects(): PlaygroundProject[] {
  return playgroundProjects.filter(project => project.isLive && !project.isAbandoned);
}