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

    const paychecks = await prisma.budgetPaycheck.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' },
      include: {
        budgetItems: true,
      },
    });

    return NextResponse.json(paychecks);
  } catch (error) {
    console.error("Error fetching paychecks:", error);
    return NextResponse.json(
      { error: "Failed to fetch paychecks" },
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

    const { amount, date, isExtra } = await request.json();

    const paycheck = await prisma.budgetPaycheck.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount),
        date: new Date(date),
        isExtra: isExtra || false,
      },
    });

    return NextResponse.json(paycheck);
  } catch (error) {
    console.error("Error creating paycheck:", error);
    return NextResponse.json(
      { error: "Failed to create paycheck" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, amount } = await request.json();

    const paycheck = await prisma.budgetPaycheck.update({
      where: { 
        id,
        userId: session.user.id, // Ensure user owns this paycheck
      },
      data: {
        amount: parseFloat(amount),
      },
    });

    return NextResponse.json(paycheck);
  } catch (error) {
    console.error("Error updating paycheck:", error);
    return NextResponse.json(
      { error: "Failed to update paycheck" },
      { status: 500 }
    );
  }
}
