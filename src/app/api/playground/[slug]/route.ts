import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;
    
    const project = await prisma.playgroundProject.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Playground project not found' }, { status: 404 });
    }

    // Check if user has access to this project
    const isAdmin = session.user.email === "admin@ajplayground.com" || session.user.email === "admin2@ajplayground.com";
    const hasAccess = project.authorId === user.id || project.isLive || isAdmin;
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied. You can only access your own projects or public live projects." },
        { status: 403 }
      );
    }

    // Add owner flag
    const projectWithOwnerFlag = {
      ...project,
      isOwner: project.authorId === user.id,
    };

    return NextResponse.json(projectWithOwnerFlag);
  } catch (error) {
    console.error('Error fetching playground project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    const isAdmin = session?.user?.email === "admin@ajplayground.com" || session?.user?.email === "admin2@ajplayground.com";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, description, component } = body;

    const project = await prisma.playgroundProject.update({
      where: { slug },
      data: {
        title,
        description,
        content: component, // Assuming component maps to content field
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating playground project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    const isAdmin = session?.user?.email === "admin@ajplayground.com" || session?.user?.email === "admin2@ajplayground.com";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    await prisma.playgroundProject.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting playground project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
