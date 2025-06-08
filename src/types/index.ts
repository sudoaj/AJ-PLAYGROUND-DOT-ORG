export interface BlogPost {
  id: string;
  title: string;
  date: string; // Could be YYYY or full date string
  imageUrl: string;
  imageHint: string; // For AI image generation hint
  slug: string; // For linking to full post (future)
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
}
