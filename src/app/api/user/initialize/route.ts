import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Initialize a user's playground projects when they first sign in
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Create the user if they don't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email,
        },
      });
    }

    // Check if user already has playground projects
    const existingProjects = await prisma.playgroundProject.findMany({
      where: { authorId: user.id },
    });

    if (existingProjects.length > 0) {
      return NextResponse.json({ 
        message: "User already has playground projects",
        projectCount: existingProjects.length 
      });
    }

    // Create initial playground projects for the user
    const initialProjects = [
      {
        slug: `tip-calculator-${user.id}`,
        title: "Tip Calculator",
        emoji: "💰",
        description: "Calculate tips and split bills with ease. Perfect for dining out with friends!",
        shortDescription: "Smart tip calculator with bill splitting",
        content: "TipCalculator",
        category: "Tool",
        isLive: true,
        isAbandoned: false,
        authorId: user.id,
      },
      {
        slug: `basic-calculator-${user.id}`,
        title: "Basic Calculator",
        emoji: "🧮",
        description: "A simple yet powerful calculator for everyday math operations.",
        shortDescription: "Essential calculator for basic math",
        content: "BasicCalculator",
        category: "Tool",
        isLive: true,
        isAbandoned: false,
        authorId: user.id,
      },
      {
        slug: `resume-builder-${user.id}`,
        title: "Resume Builder",
        emoji: "📄",
        description: "Create professional resumes with our intuitive builder. Export as PDF when ready!",
        shortDescription: "Build and customize your professional resume",
        content: "ResumeBuilder",
        category: "Tool",
        isLive: true,
        isAbandoned: false,
        authorId: user.id,
      },
    ];

    // Create the projects
    const createdProjects = await Promise.all(
      initialProjects.map((project) =>
        prisma.playgroundProject.create({
          data: project,
        })
      )
    );

    return NextResponse.json({
      message: "User playground initialized successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      projectsCreated: createdProjects.length,
      projects: createdProjects.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        emoji: p.emoji,
      })),
    });
  } catch (error) {
    console.error("Error initializing user playground:", error);
    return NextResponse.json(
      { error: "Failed to initialize user playground" },
      { status: 500 }
    );
  }
}
