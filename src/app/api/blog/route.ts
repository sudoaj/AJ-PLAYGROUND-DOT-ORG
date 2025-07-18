import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      featured: post.featured,
      tags: post.tags ? JSON.parse(post.tags) : [],
      author: post.author,
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content, excerpt, tags, published, featured } = await request.json();
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        tags: tags ? JSON.stringify(tags) : null,
        published: published || false,
        featured: featured || false,
        authorId: session.user.id,
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
