import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to match the expected interface
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      date: post.createdAt.toISOString(),
      excerpt: post.excerpt || "",
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    const isAdmin = session?.user?.email === "admin@ajplayground.com" || session?.user?.email === "admin2@ajplayground.com";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, slug, excerpt } = body;

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

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        published: true,
        authorId: adminUser.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}