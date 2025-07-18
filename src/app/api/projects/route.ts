import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Transform to match the expected interface
    const formattedProjects = projects.map((project: any) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      language: project.language,
      lastUpdated: project.updatedAt.toISOString(),
      url: project.url || "",
      featured: project.featured,
      status: project.status,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      author: project.author,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      demoUrl: project.url,
      githubUrl: project.githubUrl,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    const isAdmin = session?.user?.email === "admin@ajplayground.com" || session?.user?.email === "admin2@ajplayground.com";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        email: {
          in: ["admin@ajplayground.com", "admin2@ajplayground.com"]
        }
      }
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 400 });
    }

    const { title, description, content, language, url, featured, status, technologies } = await request.json();
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        language,
        url,
        featured: featured || false,
        status: status || "active",
        technologies: technologies ? JSON.stringify(technologies) : null,
        authorId: adminUser.id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
