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

    const bills = await prisma.budgetBill.findMany({
      where: { userId: session.user.id },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
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

    const { name, amount, dueDate, recurrence, importance, category } = await request.json();

    const bill = await prisma.budgetBill.create({
      data: {
        userId: session.user.id,
        name,
        amount: parseFloat(amount),
        dueDate: dueDate ? new Date(dueDate) : null,
        recurrence: recurrence || 'Monthly',
        importance: importance || 'Medium',
        category: category || 'Other',
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
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

    const { id, name, amount, dueDate, recurrence, importance, category } = await request.json();

    const bill = await prisma.budgetBill.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        amount: parseFloat(amount),
        dueDate: dueDate ? new Date(dueDate) : null,
        recurrence,
        importance,
        category,
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.error("Error updating bill:", error);
    return NextResponse.json(
      { error: "Failed to update bill" },
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
    const billId = searchParams.get('id');

    if (!billId) {
      return NextResponse.json({ error: "Bill ID required" }, { status: 400 });
    }

    await prisma.budgetBill.delete({
      where: {
        id: billId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return NextResponse.json(
      { error: "Failed to delete bill" },
      { status: 500 }
    );
  }
}
