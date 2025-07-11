export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface PlaygroundProject {
  id: string;
  title: string;
  emoji: string;
  description: string;
  shortDescription: string;
  slug: string;
  category: string;
  comingSoonHint: string;
  isLive?: boolean;
  isAbandoned?: boolean;
}