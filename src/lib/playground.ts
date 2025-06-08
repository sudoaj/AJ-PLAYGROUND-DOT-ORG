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
    comingSoonHint: 'Expect stunning animations, gesture controls, and a peek into tomorrow\'s computing experience.'
  },
  {
    id: '2',
    title: 'Retro Games',
    emoji: '🎮',
    description: 'A collection of classic retro games recreated with modern web technologies, bringing back the nostalgia of arcade gaming.',
    shortDescription: 'Classic arcade games reimagined for the web',
    slug: 'retro-games',
    category: 'Gaming',
    comingSoonHint: 'Get ready for Pong, Snake, Tetris, and more classics with pixel-perfect graphics and chiptune sounds.'
  },
  {
    id: '3',
    title: 'Tip Calculator',
    emoji: '💰',
    description: 'A smart tip calculator that helps you calculate tips, split bills, and even suggests appropriate tip amounts based on service quality.',
    shortDescription: 'Smart bill splitting and tip calculation',
    slug: 'tip-calculator',
    category: 'Utility',
    comingSoonHint: 'Features will include bill splitting, service rating integration, and currency conversion.'
  },
  {
    id: '4',
    title: 'Developer Cheatsheet',
    emoji: '📝',
    description: 'An interactive cheatsheet for developers with searchable syntax references, code snippets, and quick lookup tools for multiple programming languages.',
    shortDescription: 'Interactive reference guide for developers',
    slug: 'developer-cheatsheet',
    category: 'Tool',
    comingSoonHint: 'Will include syntax highlighting, interactive examples, and offline access to your favorite programming languages.'
  }
];

export function getPlaygroundProject(slug: string): PlaygroundProject | undefined {
  return playgroundProjects.find(project => project.slug === slug);
}

export function getAllPlaygroundProjects(): PlaygroundProject[] {
  return playgroundProjects;
}
