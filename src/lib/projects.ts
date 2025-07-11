import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: string;
  lastUpdated: string;
  url: string;
  featured: boolean;
  status: string;
  technologies: string[];
}

export interface ProjectWithContent extends Project {
  content: string;
}

export function getAllProjects(): Project[] {
  // Check if directory exists
  if (!fs.existsSync(projectsDirectory)) {
    console.warn(`Projects directory not found: ${projectsDirectory}`);
    return [];
  }

  const fileNames = fs.readdirSync(projectsDirectory);
  const allProjectsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      // Validate required fields
      if (!data.title || !data.slug || !data.description || !data.language) {
        console.warn(`Skipping ${fileName} due to missing required fields.`);
        return null;
      }

      return {
        id: slug,
        slug: data.slug || slug,
        title: data.title,
        description: data.description,
        language: data.language,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        url: data.url || '#',
        featured: data.featured || false,
        status: data.status || 'completed',
        technologies: data.technologies || [data.language],
      } as Project;
    });

  // Filter out nulls and sort by lastUpdated (newest first)
  const validProjects = allProjectsData.filter(project => project !== null) as Project[];
  return validProjects.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
}

export function getProjectBySlug(slug: string): ProjectWithContent | null {
  const fullPath = path.join(projectsDirectory, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.slug || !data.description || !data.language) {
      console.error(`Error processing ${slug}.md: Missing required fields.`);
      return null;
    }

    return {
      id: slug,
      slug: data.slug || slug,
      title: data.title,
      description: data.description,
      language: data.language,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      url: data.url || '#',
      featured: data.featured || false,
      status: data.status || 'completed',
      technologies: data.technologies || [data.language],
      content: content, // Raw markdown content
    } as ProjectWithContent;
  } catch (error) {
    console.error(`Error processing ${slug}.md:`, error);
    return null;
  }
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(project => project.featured);
}

export function getProjectsByTechnology(technology: string): Project[] {
  return getAllProjects().filter(project => 
    project.technologies.some(tech => 
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
}
