export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  published?: boolean;
  featured?: boolean;
  tags?: string[];
  author?: {
    name: string;
    email: string;
  };
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  language: string;
  lastUpdated: string;
  url: string;
  featured: boolean;
  status: string;
  technologies: string[];
  author?: {
    name: string;
    email: string;
  };
}

export interface PlaygroundProject {
  id: string;
  title: string;
  emoji: string;
  description: string;
  shortDescription: string;
  slug: string;
  category: string;
  comingSoonHint?: string;
  isLive?: boolean;
  isAbandoned?: boolean;
  content?: string;
  author?: {
    name: string;
    email: string;
  };
}