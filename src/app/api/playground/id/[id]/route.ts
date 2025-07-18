import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    const isAdmin = session?.user?.email === "admin@ajplayground.com" || session?.user?.email === "admin2@ajplayground.com";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, component } = body;

    const project = await prisma.playgroundProject.update({
      where: { id },
      data: {
        title,
        description,
        content: component,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    const isAdmin = session?.user?.email === "admin@ajplayground.com" || session?.user?.email === "admin2@ajplayground.com";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.playgroundProject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting playground project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
