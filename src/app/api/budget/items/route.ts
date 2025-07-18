import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paycheckId = searchParams.get('paycheckId');

    const whereClause: any = { userId: session.user.id };
    if (paycheckId) {
      whereClause.paycheckId = paycheckId;
    }

    const budgetItems = await prisma.budgetItem.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(budgetItems);
  } catch (error) {
    console.error("Error fetching budget items:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, paycheckId } = await request.json();

    const budgetItems = await prisma.budgetItem.createMany({
      data: items.map((item: { name: string; amount: number; category?: string }) => ({
        userId: session.user.id,
        paycheckId,
        name: item.name,
        amount: parseFloat(item.amount.toString()),
        category: item.category || 'Other',
      })),
    });

    return NextResponse.json(budgetItems);
  } catch (error) {
    console.error("Error creating budget items:", error);
    return NextResponse.json(
      { error: "Failed to create budget items" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await prisma.budgetItem.delete({
      where: {
        id: itemId,
        userId: session.user.id, // Ensure user owns this item
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting budget item:", error);
    return NextResponse.json(
      { error: "Failed to delete budget item" },
      { status: 500 }
    );
  }
}
