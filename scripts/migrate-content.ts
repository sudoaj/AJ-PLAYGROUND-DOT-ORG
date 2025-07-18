// Migration script to transfer existing markdown content to database
// Run with: npx tsx scripts/migrate-content.ts

import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

async function migrateContent() {
  try {
    // Get admin user to assign as author
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@ajplayground.com" }
    });

    if (!adminUser) {
      console.error("Admin user not found. Please create admin user first.");
      return;
    }

    console.log("Starting content migration...");

    // Migrate blog posts
    await migrateBlogPosts(adminUser.id);
    
    // Migrate projects
    await migrateProjects(adminUser.id);
    
    // Migrate playground projects
    await migratePlaygroundProjects(adminUser.id);

    console.log("Content migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function migrateBlogPosts(authorId: string) {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  
  if (!fs.existsSync(postsDirectory)) {
    console.log("No posts directory found, skipping blog post migration");
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory).filter(name => name.endsWith('.md'));
  
  for (const fileName of fileNames) {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const slug = fileName.replace(/\.md$/, '');
    
    try {
      await prisma.blogPost.create({
        data: {
          title: data.title || slug,
          slug,
          content,
          excerpt: data.excerpt || "",
          published: data.published !== false,
          featured: data.featured || false,
          tags: data.tags ? JSON.stringify(data.tags) : null,
          authorId,
        },
      });
      console.log(`✓ Migrated blog post: ${data.title || slug}`);
    } catch (error) {
      console.log(`✗ Failed to migrate blog post ${slug}:`, error);
    }
  }
}

async function migrateProjects(authorId: string) {
  const projectsDirectory = path.join(process.cwd(), 'content/projects');
  
  if (!fs.existsSync(projectsDirectory)) {
    console.log("No projects directory found, skipping project migration");
    return;
  }

  const fileNames = fs.readdirSync(projectsDirectory).filter(name => name.endsWith('.md'));
  
  for (const fileName of fileNames) {
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const slug = data.slug || fileName.replace(/\.md$/, '');
    
    try {
      await prisma.project.create({
        data: {
          title: data.title || slug,
          slug,
          description: data.description || "",
          content,
          language: data.language || "Unknown",
          url: data.url || "",
          featured: data.featured || false,
          status: data.status || "active",
          technologies: data.technologies ? JSON.stringify(data.technologies) : null,
          authorId,
        },
      });
      console.log(`✓ Migrated project: ${data.title || slug}`);
    } catch (error) {
      console.log(`✗ Failed to migrate project ${slug}:`, error);
    }
  }
}

async function migratePlaygroundProjects(authorId: string) {
  // Since playground projects are hardcoded, let's create some sample ones
  const playgroundProjects = [
    {
      title: "Basic Calculator",
      emoji: "🧮",
      description: "A simple calculator built with React",
      shortDescription: "Basic arithmetic operations",
      content: "# Basic Calculator\n\nA simple calculator for basic arithmetic operations.",
      category: "tools",
      slug: "basic-calculator",
      isLive: true,
    },
    {
      title: "Tip Calculator",
      emoji: "💰",
      description: "Calculate tips and split bills",
      shortDescription: "Tip and bill splitting calculator",
      content: "# Tip Calculator\n\nCalculate tips and split bills among friends.",
      category: "tools",
      slug: "tip-calculator",
      isLive: true,
    },
    {
      title: "Developer Cheatsheet",
      emoji: "📚",
      description: "Quick reference for developers",
      shortDescription: "Developer reference guide",
      content: "# Developer Cheatsheet\n\nQuick reference for common development tasks.",
      category: "reference",
      slug: "developer-cheatsheet",
      isLive: true,
    },
    {
      title: "Position Fit Analyzer",
      emoji: "📊",
      description: "Analyze job position compatibility",
      shortDescription: "Job compatibility analysis",
      content: "# Position Fit Analyzer\n\nAnalyze how well you fit a job position.",
      category: "analysis",
      slug: "position-fit",
      isLive: true,
    },
    {
      title: "Retro Games",
      emoji: "🎮",
      description: "Classic retro games collection",
      shortDescription: "Nostalgic gaming experience",
      content: "# Retro Games\n\nPlay classic retro games in your browser.",
      category: "games",
      slug: "retro-games",
      isLive: true,
    },
  ];

  for (const project of playgroundProjects) {
    try {
      await prisma.playgroundProject.create({
        data: {
          ...project,
          authorId,
        },
      });
      console.log(`✓ Created playground project: ${project.title}`);
    } catch (error) {
      console.log(`✗ Failed to create playground project ${project.title}:`, error);
    }
  }
}

migrateContent();
