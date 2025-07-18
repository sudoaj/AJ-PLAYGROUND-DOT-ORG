// This is a simple script to create an admin user for testing
// Run with: npx tsx scripts/create-admin.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const admin = await prisma.user.upsert({
      where: { email: "admin@ajplayground.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@ajplayground.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Admin user created:", {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
    
    console.log("\nYou can now sign in with:");
    console.log("Email: admin@ajplayground.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
