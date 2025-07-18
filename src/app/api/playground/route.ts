import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is admin
    const isAdmin = session.user.email === "admin@ajplayground.com" || session.user.email === "admin2@ajplayground.com";

    // Fetch projects based on user role
    const projects = await prisma.playgroundProject.findMany({
      where: isAdmin ? {} : {
        OR: [
          { authorId: user.id }, // User's own projects
          { isLive: true }, // Public live projects
        ],
      },
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
      emoji: project.emoji,
      description: project.description,
      shortDescription: project.shortDescription,
      category: project.category,
      comingSoonHint: project.comingSoonHint,
      isLive: project.isLive,
      isAbandoned: project.isAbandoned,
      author: project.author,
      component: project.content, // Map content to component for frontend
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      isOwner: project.authorId === user.id, // Add owner flag
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching playground projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch playground projects" },
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

    const { 
      title, 
      emoji, 
      description, 
      shortDescription, 
      content,
      category, 
      comingSoonHint,
      isLive,
      isAbandoned 
    } = await request.json();
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const project = await prisma.playgroundProject.create({
      data: {
        title,
        slug,
        emoji,
        description,
        shortDescription,
        content,
        category,
        comingSoonHint,
        isLive: isLive || false,
        isAbandoned: isAbandoned || false,
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
    console.error("Error creating playground project:", error);
    return NextResponse.json(
      { error: "Failed to create playground project" },
      { status: 500 }
    );
  }
}
