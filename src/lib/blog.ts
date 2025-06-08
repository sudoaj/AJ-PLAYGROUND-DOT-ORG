import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types'; // Assuming BlogPost is in @/types

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents); // data is the frontmatter

      // Validate that all required BlogPost fields are present in frontmatter
      // or can be derived. 'id' will be the slug.
      if (!data.title || !data.date || !slug || !data.excerpt || !data.imageUrl || !data.imageHint) {
        console.warn(`Skipping ${fileName} due to missing frontmatter fields.`);
        return null;
      }
      
      return {
        id: slug,
        slug: slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        imageUrl: data.imageUrl,
        imageHint: data.imageHint,
      } as BlogPost; // Type assertion
    });

  // Filter out any nulls from posts that were skipped
  return allPostsData.filter(post => post !== null) as BlogPost[];
}

// Define a new interface for a post with HTML content
export interface BlogPostWithContent extends BlogPost {
  content: string;
}

export function getBlogPostBySlug(slug: string): BlogPostWithContent | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.date || !slug || !data.excerpt || !data.imageUrl || !data.imageHint) {
      console.error(`Error processing ${slug}.md: Missing frontmatter fields.`);
      return null;
    }

    // Return raw markdown content instead of HTML
    return {
      id: slug,
      slug: slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
      content: content, // Raw markdown content
    } as BlogPostWithContent; // Type assertion
  } catch (error) {
    // Handle file not found or other errors
    console.error(`Error processing ${slug}.md:`, error);
    return null;
  }
}
